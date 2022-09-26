<pre> <code>

import { Op } from 'sequelize'
   
   // Revisar que el usuario registrado sea unico
    // const usuario = await User.findOne({
    //   where: {
    //     [Op.or]: [
    //       { email },
    //       { ci }
    //     ]
    //   }
    // })

    // if (usuario) {
    //   return res.status(400).json({ msg: 'El usuario ya existe' })
    // }

Para formatear de path a url 
    // const imageProfile = req.file.path.replace(/\\/g, "/")
    // const avatar = './' + imageProfile
</code></pre>
