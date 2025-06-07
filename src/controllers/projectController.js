import {
    createProjectService,
    listProjectService,
    retrieveProjectService,
    deleteProjectService,
    updateProjectService,

    createCategoryService,
    listCategoryService,
    retrieveCategoryService,
    deleteCategoryService,
    updateCategoryService,
} from '../services/projectService.js'

import { upload } from '../../config/uploadConfig.js';
import { Project } from '../models/projectModel.js';
import {Category} from '../models/projectModel.js';
import { cloudinary } from '../../config/uploadConfig.js';
import slugify from 'slugify';


export const createProjectController = async (req, res, next) => {
    return await createProjectService(req, res, next)
}
export const listProjectController = async (req, res, next) => {
    return await listProjectService(req, res, next)
}
export const retrieveProjectController = async (req, res, next) => {
    return await retrieveProjectService(req, res, next)
}
export const deleteProjectController = async (req, res, next) => {
    return await deleteProjectService(req, res, next)
}
export const updateProjectController = async (req, res, next) => {
    return await updateProjectService(req, res, next)
}

// Category Controller

export const createCategoryController = async (req, res, next) => {
    return await createCategoryService(req, res, next)
}
export const listCategoryController = async (req, res, next) => {
    return await listCategoryService(req, res, next)
}
export const retrieveCategoryController = async (req, res, next) => {
    return await retrieveCategoryService(req, res, next)
}
export const deleteCategoryController = async (req, res, next) => {
    return await deleteCategoryService(req, res, next)
}
export const updateCategoryController = async (req, res, next) => {
    return await updateCategoryService(req, res, next)
}


// export const createProjectWithMedia = [
//     upload.fields([
//         { name: 'images', maxCount: 5 },
//         { name: 'video', maxCount: 1 },
//     ]),
//     async (req, res) => {
//         try {
//             const { title, description, category: categoryName } = req.body;

//             if (!title || !description || !categoryName) {
//                 return res.status(400).json({ message: 'All required fields must be filled' });
//             }

//             // Generate slug from title
//             const slug = slugify(title, { lower: true, strict: true });

//             // Check for duplicate slug
//             const existingProject = await Project.findOne({ slug });
//             if (existingProject) {
//                 return res.status(400).json({ message: 'A project with this title already exists' });
//             }

//             // Find category by name (instead of ID)
//             const category = await Category.findOne({ name: categoryName.trim().toLowerCase() });

//             console.log(category);
//             if (!category) {
//                 return res.status(400).json({ message: 'Invalid category' });
//             }

//             const images = (req.files)?.images || [];
//             const video = (req.files)?.video?.[0];

//             if (images.length === 0) {
//                 return res.status(400).json({ message: 'At least one image is required' });
//             }

//             const imageUrls = images.map((file) => file.path);
//             const videoUrl = video ? video.path : null;

//             const newProject = new Project({
//                 title,
//                 description,
//                 slug,
//                 category: category._id,
//                 images: imageUrls,
//                 video: videoUrl,
//             });

//             const savedProject = await newProject.save();

//             return res.status(201).json({ message: 'Project created successfully', project: savedProject });
//         } catch (error) {
//             console.error('Error:', error);
//             return res.status(500).json({ message: 'Internal server error', error: error.message });
//         }
//     }
// ];

export const createProjectWithMedia = [
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'video', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, category: categoryId } = req.body;

      // Debug
      console.log('req.body:', req.body);
      console.log('categoryId:', categoryId);

      // Validate required fields
      if (!title || !description || !categoryId) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }

      // Generate slug
      const slug = slugify(title, { lower: true, strict: true });

      // Check for duplicate slug
      const existingProject = await Project.findOne({ slug });
      if (existingProject) {
        return res.status(400).json({ message: 'A project with this title already exists' });
      }

      // Find category by ID
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }

      // Process files
      const images = req.files?.images || [];
      const video = req.files?.video?.[0];

      if (images.length === 0) {
        return res.status(400).json({ message: 'At least one image is required' });
      }

      const imageUrls = images.map(file => file.path);
      const videoUrl = video ? video.path : null;

      // Create and save new project
      const newProject = new Project({
        title,
        description,
        slug,
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

// READ ALL
// export const getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.find().populate('category');
//     res.status(200).json({ projects });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching projects', error: error.message });
//   }
// };

export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('category')
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

// READ ONE
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('category');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

// UPDATE

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Handle category update
    if (updates.category) {
      const category = await Category.findOne({ name: updates.category.toLowerCase() });
      if (!category) {
        return res.status(400).json({ message: 'Invalid category' });
      }
      updates.category = category._id;
    }

    // Handle new images
    if (req.files?.images?.length > 0) {
      // Delete old images from Cloudinary
      for (const url of project.images) {
        const publicId = url.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce-images/${publicId}`);
      }

      // Save new image URLs
      updates.images = req.files.images.map(file => file.path);
    }

    // Handle new video
    if (req.files?.video?.length > 0) {
      if (project.video) {
        const publicId = project.video.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce-videos/${publicId}`, { resource_type: 'video' });
      }

      updates.video = req.files.video[0].path;
    }

    // Apply updates
    const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true }).populate('category');

    res.status(200).json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};


export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const url of project.images) {
        const publicId = url.split('/').pop()?.split('.')[0];
        await cloudinary.uploader.destroy(`ecommerce-images/${publicId}`);
      }
    }

    // Delete video from Cloudinary
    if (project.video) {
      const publicId = project.video.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`ecommerce-videos/${publicId}`, {
        resource_type: 'video',
      });
    }

    // Delete project from DB
    await project.deleteOne();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};