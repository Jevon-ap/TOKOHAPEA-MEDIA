const imageKit = require('../libs/imagekit')

module.exports={
    storageImage: async (req, res) => {
        try {
            if (!req.file) {
                throw new Error("No image file provided");
            }

            const stringFile = req.file.buffer.toString('base64');

            const uploadFile = await imageKit.upload({
                fileName: req.file.originalname,
                file: stringFile
            });

            const updatedUser = await prisma.user.update({
                where: { id: req.user.userId },
                data: { profile_picture: uploadFile.url },
            });

            return res.json({
                status: true,
                message: 'Image uploaded successfully',
                data: {
                    url: uploadFile.url
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    imageKitUpload: async (req,res)=>{

        try {

            const stringFile = req.file.buffer.toString('base64')

            const uploadFile = await imageKit.upload({
                fileName:req.file.originalname,
                file : stringFile
            })

            return res.json({
                status: true,
                message:'success',
                data:{
                    name:uploadFile.name,
                    url:uploadFile.url,
                    type:uploadFile.fileType
                }
            })
            
        } catch (error) {
            
        }
        
    }
}