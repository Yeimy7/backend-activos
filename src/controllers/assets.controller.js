import Asset from '../models/Asset'

export const createAsset = async (req, res) => {
  try {
    const assetSaved = await Asset.create(req.body)
    res.status(201).json(assetSaved)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll()
    // res.json({assets}) // Otra forma de devolver datos 
    res.json(assets)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findAll({ where: { id_activo: req.params.assetId }, attributes: { exclude: ['id'] } })
    res.json(asset)
  } catch (error) {
    res.status(500).send('Hubo un error')
  }
}

export const updateAssetById = async (req, res) => {
  // Extraer la información del proyecto
  const { nombre } = req.body
  try {
    // Revisar el ID
    let asset = await Asset.findByPk(req.params.assetId)

    // Si el proyecto existe o no
    if (!asset) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }
    if (nombre) {
      asset.nombre = nombre
    }
    const updatedAsset = await asset.save()
    res.status(200).json(updatedAsset)
  } catch (error) {
    res.status(500).send('Error en el servidor')
  }
}

export const deleteAssetById = async (req, res) => {
  try {
    let asset = await Asset.findByPk(req.params.assetId)

    if (!asset) {
      return res.status(404).json({ msg: 'Activo no encontrado' })
    }

    await Asset.destroy({ where: { id_activo: req.params.assetId } })
    res.json({ msg: 'activo eliminado' })

  } catch (error) {
    console.log(error)
    res.status(500).send('Error en el servidor')
  }
}