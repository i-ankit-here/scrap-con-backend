import { ScrapCategory } from "../../models/ScrapCategory.js"

export const createScrapCategory = async (req, res, next) => {
  try {
    const { name, pricePerUnit } = req.body

    const existingCategory = await ScrapCategory.findOne({ name })
    if (existingCategory) {
      res.status(400)
      throw new Error("Scrap category already exists")
    }

    const scrapCategory = new ScrapCategory({
      name,
      pricePerUnit,
    })

    const savedCategory = await scrapCategory.save()

    res.status(201).json(savedCategory)
  } catch (error) {
    next(error)
  }
}

export const getAllScrapCategories = async (req, res, next) => {
  try {
    const categories = await ScrapCategory.find({ })
    res.json(categories)
  } catch (error) {
    next(error)
  }
}

export const getScrapCategoryById = async (req, res, next) => {
  try {
    const category = await ScrapCategory.findById(req.params.id)
    if (category) {
      res.json(category)
    } else {
      res.status(404)
      throw new Error("Scrap category not found")
    }
  } catch (error) {
    next(error)
  }
}

export const updateScrapCategory = async (req, res, next) => {
  try {
    const { name, pricePerUnit } = req.body

    const category = await ScrapCategory.findById(req.params.id)

    if (category) {
      category.name = name || category.name
      category.pricePerUnit = pricePerUnit || category.pricePerUnit

      const updatedCategory = await category.save()
      res.json(updatedCategory)
    } else {
      res.status(404)
      throw new Error("Scrap category not found")
    }
  } catch (error) {
    next(error)
  }
}

export const deleteScrapCategory = async (req, res, next) => {
  try {
    const category = await ScrapCategory.findById(req.params.id)

    if (category) {
      category.isActive = false
      await category.save()
      res.json({ message: "Scrap category deactivated" })
    } else {
      res.status(404)
      throw new Error("Scrap category not found")
    }
  } catch (error) {
    next(error)
  }
}

