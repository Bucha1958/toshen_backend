import { Equipment } from "../models/equipmentModel.js";

// GET all equipment
export const getAllEquipment = async (req, res) => {
  try {
    const equipmentList = await Equipment.find();
    res.json(equipmentList);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET single equipment by ID
export const getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// CREATE new equipment
export const createEquipment = async (req, res) => {
  try {
    const { name, type, no } = req.body;
    const newEquipment = new Equipment({ name, type, no });
    await newEquipment.save();
    res.status(201).json(newEquipment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create equipment' });
  }
};

// UPDATE equipment by ID
export const updateEquipment = async (req, res) => {
  try {
    const { name, type, no } = req.body;
    const updatedEquipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      { name, type, no },
      { new: true }
    );
    if (!updatedEquipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update equipment' });
  }
};

// DELETE equipment by ID
export const deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Equipment not found' });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete equipment' });
  }
};


