const multer = require('multer')
const path = require('path')

const filename= (req,file,callback)=>{
    const fileName = Date.now()+path.extname(file.originalname)
    callback(null,fileName)
}
const generateStorage = (destination)=>{
    return multer.diskStorage({
        destination:(req,file,callback)=>{
            callback(null,destination)
        },
        filename
    })
}

module.exports = {
    image:multer({
        storage:generateStorage('./public/images'),
        fileFilter:(req,file,callback)=>{
            const allowedMineTypes = ['image/png','image/jpg','image/jpeg']
            if (allowedMineTypes.includes(file.mimetype)) {
                callback(null,true)   
            }else{
                const err = new Error(`Only ${allowedMineTypes.join(', ')} allowed to upload`)
                callback(err,false)
            }
        },
        onError:(err,next)=>{
            next(err)
        }
    })
}