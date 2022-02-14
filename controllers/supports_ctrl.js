const db = require('../models');
const supports = db.supports;
const Constant = require("../config/constant");

const Supports = {};
Supports.add = async (req,res) => {
    try {
    let {type,name,email,phone,subject,description} = req.body
    let SupportsData = {
        type:type,
        name:name,
        email:email,
        phone:phone,
        subject:subject,
        description:description
    }
    const add = await supports.create(SupportsData);
    res.status(200).send(add);
}catch(error){
    return res.status(Constant.SERVER_ERROR).json({
        code: Constant.SERVER_ERROR,
        message: Constant.SOMETHING_WENT_WRONG,
        data: error,
      });
}
}

Supports.edit = async (req,res) => {
    try {
        let {id} = req.body;
        let edit = await supports.update(req.body,{where :{id:id}})
        res.status(200).send(edit)

    }catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error,
          });
    }
} 

Supports.delete = async (req,res) => {
    try 
    {
        let {id} = req.body
        await supports.destroy({where :{id:id}})
        res.status(200).send("deleted");
    }catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error,
          });
    }
}
Supports.get = async (req,res) => {
    try {
        let {search,type} = req.query
        let condition = {
            status : true
        }
        if(type){
            condition['$Supports.type$'] = type
        }
        if (search) {
        condition['$or'] ={
            "type": {
                $like: `%${search}%`
            },
        }
        supports.findAll({
            where : condition,
            attributes: ["name", "type", "description", "email", "phone"],

        }).then(result => {
            result = JSON.parse(JSON.stringify(result));
            let message = (result.length > 0) ? Constant.RETRIEVE_SUCCESS : Constant.NO_DATA_FOUND
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: message,
                data: result
            })
        }).catch(error => {
            return res.status(Constant.SERVER_ERROR).json({
                code: Constant.SERVER_ERROR,
                message: Constant.SOMETHING_WENT_WRONG,
                data: error
            })
        })
    }else{
            let data =await supports.findAll({})
            res.status(200).send(data);
        }
            }catch (error) {
                return res.json({
                    code: Constant.ERROR_CODE,
                    massage: Constant.SOMETHING_WENT_WRONG,
                    data: error
                })
            }
        }
        

module.exports = Supports;
