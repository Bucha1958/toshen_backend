
import { Project, Category } from '../models/projectModel.js';
import { upload } from '../../config/uploadConfig.js'

// TODO: createProject & UpdateProject
// export const createProjectService = async (req, res, next) => {

//     const { slug, description, category_id } = req.body;

//     // Validate input
//     if (!slug || !description || !category_id) {
//         return res.status(400).json({ message: 'Name, description, and category_id are required.' });
//     }

//     try {
//         // Optional: Check if category exists
//         const categoryExists = await Category.findOne({
//             $or: [
//                 { _id: category_id },
//                 { slug: category_id },
//                 {slug: slug.toLowerCase()?.replace(/ /g, '-')},
//             ],
//         });
//         if (categoryExists) {
//             return res.status(404).json({ message: 'Category not found.' });
//         }

//         // Create project
//         const project = await Project.create({
//             slug,
//             description,
//             category: category_id,
//             image: req.file ? req.file.image : null,
//             slug: slug.toLowerCase().replace(/ /g, '-'),
//         });
//         return res.status(201).json({ project });
//     } catch (error) {
//         console.error('Error creating project:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };

export const createProjectService = [
    // Ensure multer is configured with .fields() in your middleware
    upload.fields([
        { name: 'images', maxCount: 5 },
        { name: 'video', maxCount: 1 },
    ]),

    async (req, res) => {
        try {
            const { slug, description, category: categoryName, title } = req.body;

            if (!slug || !description || !categoryName || !title) {
                return res.status(400).json({ message: 'All required fields must be filled' });
            }

            // Normalize the slug
            const normalizedSlug = slug.toLowerCase().replace(/ /g, '-');

            // Check if the category exists (by name)
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(400).json({ message: 'Invalid category Id' });
            }

            // Get uploaded files
            const images = (req.files?.images) || [];
            const video = req.files?.video?.[0];

            if (images.length === 0) {
                return res.status(400).json({ message: 'At least one image is required' });
            }

            const imageUrls = images.map((file) => file.path);
            const videoUrl = video ? video.path : null;

            // Create and save the project
            const newProject = new Project({
                title,
                slug: normalizedSlug,
                description,
                category: category._id,
                images: imageUrls,
                video: videoUrl,
            });

            const savedProject = await newProject.save();

            return res.status(201).json({ message: 'Project created successfully', project: savedProject });

        } catch (error) {
            console.error('Error creating project:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }
];

export const listProjectService = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query
    try {
        const projects = await Project.find()
            .populate('category')
            .skip((page - 1) * limit)
            .limit(limit)
        const totalProjects = await Project.countDocuments()
        return res.status(200).json({
            projects,
            totalPages: Math.ceil(totalProjects / limit),
            currentPage: page,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export const retrieveProjectService = async (req, res, next) => {
    const { slug } = req.params
    try {
        const project = await Project.findOne({ slug }).populate('category')
        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ project })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export const deleteProjectService = async (req, res, next) => {
    const { slug } = req.params
    try {
        const project = await Project.findOneAndDelete({ slug })
        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ message: 'Project deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export const updateProjectService = async (req, res, next) => {
    const { slug } = req.params
    const { name, description, category } = req.body
    try {
        const project = await Project.findOneAndUpdate(
            { slug },
            { name, description, category },
            { new: true }
        )
        if (!project) {
            return res.status(404).json({ message: 'Project not found' })
        }
        return res.status(200).json({ project, message: 'Project updated successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}


export const createCategoryService = async (req, res, next) => {
    const { name, description } = req.body;

    console.log('Creating category:', name, description);
    
    try {
        const category = await Category.create({ name, description })
        return res.status(201).json({ category, message: 'Category created successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Category already exist!' })
    }
}

export const listCategoryService = async (req, res, next) => {

    const { page = 1, limit = 10 } = req.query
    try {
        const categories = await Category.find()
            .skip((page - 1) * limit)
            .limit(limit)
        const totalCategories = await Category.countDocuments()
        return res.status(200).json({
            categories,
            totalPages: Math.ceil(totalCategories / limit),
            currentPage: page,
        })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const retrieveCategoryService = async (req, res, next) => {
    const { id } = req.params
    try {
        const category = await Category.findById(id)
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ category })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export const deleteCategoryService = async (req, res, next) => {
    const { id } = req.params
    try {
        const category = await Category.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ message: 'Category deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateCategoryService = async (req, res, next) => {
    const { id } = req.params
    const { name, description } = req.body
    try {
        const category = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        )
        if (!category) {
            return res.status(404).json({ message: 'Category not found' })
        }
        return res.status(200).json({ category, message: 'Category updated successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' })
    }
}