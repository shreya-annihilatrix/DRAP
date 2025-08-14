const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const Volunteer = require('../models/Volunteer');
const Incident = require('../models/Incident');
const Shelter = require('../models/Shelter');
const Task = require('../models/Task');
const TaskType = require('../models/TaskType');
const ResourceType = require('../models/ResourceType');
const TransportationTask = require('../models/TransportationTask');
const FoodTask = require('../models/FoodTask');
const RescueTask = require('../models/RescueTask');
const ResourceDist=require('../models/ResourceDist');

// Generate the next available typeId
const getNextTypeId = async () => {
  const lastTask = await TaskType.find().sort({ typeId: -1 }).limit(1);
  return lastTask.length > 0 ? lastTask[0].typeId + 1 : 1; // Start from 1 if empty
};

// ✅ Add Task Type
router.post("/insert", async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the task type already exists
    let existingTask = await TaskType.findOne({ name });
    if (existingTask) {
      return res.status(400).json({ message: "Task type already exists" });
    }

    const typeId = await getNextTypeId(); // Generate a unique typeId
    const task = new TaskType({ typeId, name });
    await task.save();

    res.status(201).json({ message: "Task type added successfully", task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all Task Types
router.get("/list", async (req, res) => {
  try {
    const tasks = await TaskType.find().sort({ typeId: 1 }); // Sort by typeId
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Delete a Task Type
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await TaskType.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ message: "Task type not found" });
    }
    res.status(200).json({ message: "Task type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// Get List of Unique Skills from Volunteers
router.get('/skills', async (req, res) => {
  try {
    const skills = await Volunteer.distinct("skills");
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get Volunteers by Skill and Task Status
router.get('/volunteers/:skill', async (req, res) => {
  try {
    const { skill } = req.params;
    const volunteers = await Volunteer.find({
      skills: skill,
      taskStatus: 0 // Only available volunteers
    }).populate("userId", "name email phone"); // Fetch name, email, and phone from users
    ;
    res.json(volunteers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});
// Get Volunteers
router.get('/res-types', async (req, res) => {
  try {
    const restypes = await ResourceType.find();
    res.json(restypes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ResourceType" });
  }
});



// Get Volunteers
router.get('/volunteers', async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch volunteers" });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const incidents = await Incident.find();
    if (!incidents || incidents.length === 0) {
      return res.status(404).json({ error: "No incidents found" });
    }
    res.json(incidents);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});


// Get Shelters
router.get('/shelters', async (req, res) => {
  try {
    const shelters = await Shelter.find();
    res.json(shelters);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch shelters" });
  }
});

// Get Volunteers with "Rescue Operator" skill
router.get('/rescueVolunteers', async (req, res) => {
  try {
    const rescueVolunteers = await Volunteer.find({ skills: "Rescue Operator" });
    res.json(rescueVolunteers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch rescue volunteers" });
  }
});

// Assign Task
router.post("/add", async (req, res) => {
  try {
    const { task, extraData } = req.body;

    // Step 1: Save common task details
    const newTask = new Task({ ...task });
    const savedTask = await newTask.save();

    // Step 2: If Transportation Task, save extra details with task ID
    if (task.taskType === "Transportation and Distribution") {
      const transportTask = new TransportationTask({
        taskId: savedTask._id, // Reference to main task
        shelter: extraData.shelter,
        resourceType: extraData.resourceType,
        deliveryDateTime: extraData.deliveryDateTime
      });
      await transportTask.save();
    }
    // Step 2: If Preparing and Serving Food Task, save extra details with task ID
    if (task.taskType === "Preparing and Serving Food") {
      const foodTask = new FoodTask({
        taskId: savedTask._id, // Reference to main task
        shelter: extraData.shelter,

      });
      await foodTask.save();
    }

        // Step 2: If Preparing and Serving Food Task, save extra details with task ID
        if (task.taskType === "Resource Distribution") {
          const resTask = new ResourceDist({
            taskId: savedTask._id, // Reference to main task
            shelter: extraData.shelter,
    
          });
          await resTask.save();
        }

    // Step 2: If Rescue Task, save extra details with task ID
    if (task.taskType === "Rescue Operation Management") {
      const rescueTask = new RescueTask({
        taskId: savedTask._id // Reference to main task

      });
      await rescueTask.save();
    }
    // Step 2: If Rescue Task, save extra details with task ID
    if (task.taskType === "Rescue Operator") {
      const rescueTask = new RescueTask({
        taskId: savedTask._id // Reference to main task

      });
      await rescueTask.save();
    }
    // Step 3: Update volunteer's taskStatus to 1 (Assigned)
    await Volunteer.findByIdAndUpdate(task.volunteer, { taskStatus: 1 });

    res.status(201).json({ message: "Task assigned successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign task" });
  }
});


// Get tasks by task type
router.get('/by-type/:taskType', async (req, res) => {
  try {
    const { taskType } = req.params;

    // Get all tasks of the specified type
    const tasks = await Task.find({ taskType })
      .sort({ createdAt: -1 }); // Sort by newest first

    // Create an array to hold the enhanced task data
    const enhancedTasks = [];

    // For each task, fetch the volunteer and any type-specific details
    for (const task of tasks) {
      // Get volunteer information
      const volunteer = await Volunteer.findById(task.volunteer).populate('userId', 'name email phone');

      // Get incident information
      const incident = await Incident.findById(task.incident);

      // Initialize additional details object
      let additionalDetails = {};

      // Based on task type, fetch additional details
      if (taskType === 'Transportation and Distribution') {
        const transportDetails = await TransportationTask.findOne({ taskId: task._id });
        if (transportDetails) {
          const shelter = await Shelter.findById(transportDetails.shelter);
          const resourceType = await ResourceType.findById(transportDetails.resourceType);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            resourceType: resourceType ? resourceType.name : 'Unknown',
            deliveryDateTime: transportDetails.deliveryDateTime
          };
        }
      } else if (taskType === 'Preparing and Serving Food') {
        const foodDetails = await FoodTask.findOne({ taskId: task._id });
        if (foodDetails) {
          const shelter = await Shelter.findById(foodDetails.shelter);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown'
          };
        }
      }
      else if (taskType === 'Resource Distribution') {
        const resDetails = await ResourceDist.findOne({ taskId: task._id });
        if (resDetails) {
          const shelter = await Shelter.findById(resDetails.shelter);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown'
          };
        }
      } else if (taskType === 'Rescue Operation Management' || taskType === 'Rescue Operator') {
        // Nothing additional to fetch for rescue tasks
        const rescueDetails = await RescueTask.findOne({ taskId: task._id });
        additionalDetails = {};
      }

      // Add enhanced task to array
      enhancedTasks.push({
        _id: task._id,
        taskType: task.taskType,
        description: task.description,
        createdAt: task.createdAt,
        volunteer: volunteer ? {
          _id: volunteer._id,
          name: volunteer.userId ? volunteer.userId.name : 'Unknown',
          email: volunteer.userId ? volunteer.userId.email : 'Unknown',
          phone: volunteer.userId ? volunteer.userId.phone : 'Unknown',
          taskStatus: volunteer.taskStatus
        } : null,
        incident: incident ? {
          location: incident.location,
          type: incident.type,
          severity: incident.severity
        } : null,
        ...additionalDetails
      });
    }

    res.status(200).json(enhancedTasks);
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all task types (this route is already in your code, including for reference)
router.get('/list', async (req, res) => {
  try {
    const tasks = await TaskType.find().sort({ typeId: 1 });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get tasks assigned to a specific volunteer
router.get('/volunteer/:volunteerId', async (req, res) => {
  try {
    const { volunteerId } = req.params;

    // Find all tasks assigned to this volunteer
    const tasks = await Task.find({ volunteer: volunteerId })
      .sort({ createdAt: -1 }); // Sort by newest first

    // Create an array to hold the enhanced task data
    const enhancedTasks = [];

    // For each task, fetch the additional details based on task type
    for (const task of tasks) {
      // Get incident information
      const incident = await Incident.findById(task.incident);

      // Initialize additional details object
      let additionalDetails = {};

      // Based on task type, fetch additional details
      if (task.taskType === 'Transportation and Distribution') {
        const transportDetails = await TransportationTask.findOne({ taskId: task._id });
        if (transportDetails) {
          const shelter = await Shelter.findById(transportDetails.shelter);
          const resourceType = await ResourceType.findById(transportDetails.resourceType);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            shelterLatitude: shelter ? shelter.latitude : null,
            shelterLongitude: shelter ? shelter.longitude : null,
            resourceType: resourceType ? resourceType.name : 'Unknown',
            deliveryDateTime: transportDetails.deliveryDateTime
          };
        }
      } else if (task.taskType === 'Preparing and Serving Food') {
        const foodDetails = await FoodTask.findOne({ taskId: task._id });
        if (foodDetails) {
          const shelter = await Shelter.findById(foodDetails.shelter);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            shelterLatitude: shelter ? shelter.latitude : null,
            shelterLongitude: shelter ? shelter.longitude : null
          };
        }
      }  else if (task.taskType === 'Resource Distribution') {
        const resDetails = await ResourceDist.findOne({ taskId: task._id });
        if (resDetails) {
          const shelter = await Shelter.findById(resDetails.shelter);

          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            shelterLatitude: shelter ? shelter.latitude : null,
            shelterLongitude: shelter ? shelter.longitude : null
          };
        }
      }
      else if (task.taskType === 'Rescue Operation Management' || task.taskType === 'Rescue Operator') {
        // Nothing additional to fetch for rescue tasks
        additionalDetails = {};
      }

      // Add enhanced task to array
      enhancedTasks.push({
        _id: task._id,
        taskType: task.taskType,
        description: task.description,
        createdAt: task.createdAt,
        incident: incident ? {
          location: incident.location,
          type: incident.type,
          severity: incident.severity,
          latitude: incident.latitude,
          longitude: incident.longitude
        } : null,
        ...additionalDetails
      });
    }

    res.status(200).json(enhancedTasks);
  } catch (error) {
    console.error('Error fetching volunteer tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update task status (accept or reject)
// Update task status (accept or reject)
router.put('/update-status/:volunteerId/:taskId', async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body; // status should be 2 for accept, 3 for reject

    // Validate status
    if (![2, 3].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find the volunteer
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Update the volunteer's taskStatus field
    volunteer.taskStatus = status;
    await volunteer.save();

    const statusText = status === 2 ? 'accepted' : 'rejected';
    res.status(200).json({ message: `Task ${statusText} successfully` });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get volunteer by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Find volunteer document by userId
    const volunteer = await Volunteer.findOne({ userId })
      .populate('userId', 'name email phone'); // Populate user details

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    res.status(200).json(volunteer);
  } catch (error) {
    console.error('Error fetching volunteer by userId:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Get status for a specific task for a specific volunteer
router.get('/status/:userId/:taskId', async (req, res) => {
  try {
    const { userId, taskId } = req.params;
    //console.log(taskId)
    // console.log(userId)
    const volunteer = await Volunteer.findOne({ _id: userId });

    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    // Check if the volunteer has a taskStatuses array
    if (!volunteer.taskStatus || !Array.isArray(volunteer.taskStatus)) {
      // If no taskStatuses array, default to status 1 (pending)
      return res.status(200).json({ taskStatus: 1 });
    }

    // Find the status for this specific task
    const taskStatus = volunteer.taskStatus.find(
      ts => ts.taskId && ts.taskId.toString() === taskId
    );

    if (!taskStatus) {
      // If no status found for this task, default to status 1 (pending)
      return res.status(200).json({ taskStatus: 1 });
    }

    res.status(200).json({ taskStatus: taskStatus.status });
  } catch (error) {
    console.error('Error fetching task status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.get("/volunteer/:userId/accepted", async (req, res) => {
  try {
    const { userId } = req.params;
    const volunteer = await Volunteer.findOne({ userId }).populate("userId", "_id name email phone");
    if (!volunteer) {
      return res.status(404).json({ message: "Volunteer not found" });
    }
    if (volunteer.taskStatus != 2) {
      return "no accepted tasks"

    }
    else {

      console.log(volunteer.taskStatus)

      // Find tasks and populate incident data
      const tasks = await Task.find({ volunteer: volunteer._id })
        .populate("incident", "location type severity latitude longitude")
        .sort({ updatedAt: -1 }); // Sort by most recent first

      // Enhanced tasks with shelter information
      const enhancedTasks = await Promise.all(tasks.map(async (task) => {
        const taskObj = task.toObject();

        // For transportation tasks, get shelter details
        if (task.taskType === 'Transportation and Distribution') {
          const transportDetails = await TransportationTask.findOne({ taskId: task._id.toString() })
            .populate("resourceType", "name");

          if (transportDetails) {
            // Add resource type and delivery date
            taskObj.resourceType = transportDetails.resourceType?.name || 'Medical Supplies';
            // console.log(transportDetails);
            // console.log(transportDetails.resourceType?.name);
            taskObj.deliveryDate = transportDetails.deliveryDateTime;

            if (transportDetails.shelter) {
              // console.log(transportDetails.shelter)
              const shelter = await Shelter.findById(transportDetails.shelter.toString());
              // console.log(shelter)
              if (shelter) {
                taskObj.shelter = {
                  location: shelter.location,
                  latitude: shelter.latitude,
                  longitude: shelter.longitude
                };
              }

            }
          }
        }
        // For transportation tasks, get shelter details
        if (task.taskType === 'Preparing and Serving Food') {
          const foodDetails = await FoodTask.findOne({ taskId: task._id.toString() })

          if (foodDetails) {
            // Add resource type and delivery date
            // console.log(transportDetails);
            // console.log(transportDetails.resourceType?.name);
           // console.log(foodDetails)
            //taskObj.deliveryDate = transportDetails.deliveryDateTime;

            if (foodDetails.shelter) {
              // console.log(transportDetails.shelter)
              const shelter = await Shelter.findById(foodDetails.shelter.toString());
              // console.log(shelter)
              if (shelter) {
                taskObj.shelter = {
                  location: shelter.location,
                  latitude: shelter.latitude,
                  longitude: shelter.longitude
                };
              }

            }
          }
        }
         // For transportation tasks, get shelter details
         if (task.taskType === 'Resource Distribution') {
          const resDetails = await ResourceDist.findOne({ taskId: task._id.toString() })

          if (resDetails) {
            // Add resource type and delivery date
            // console.log(transportDetails);
            // console.log(transportDetails.resourceType?.name);
           // console.log(foodDetails)
            //taskObj.deliveryDate = transportDetails.deliveryDateTime;

            if (resDetails.shelter) {
              // console.log(transportDetails.shelter)
              const shelter = await Shelter.findById(resDetails.shelter.toString());
              // console.log(shelter)
              if (shelter) {
                taskObj.shelter = {
                  location: shelter.location,
                  latitude: shelter.latitude,
                  longitude: shelter.longitude
                };
              }

            }
          }
        }
        return taskObj;

      }));

      res.json(enhancedTasks);
    }
  } catch (error) {
    console.error("Error fetching accepted tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET task details by ID
router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("incident", "location type severity latitude longitude");
    //console.log(task);
    if (!task) return res.status(404).json({ message: "Task not found" });

    let additionalDetails = {};

    if (task.taskType === "Transportation and Distribution") {
      const transportDetails = await TransportationTask.findOne({ taskId }).populate("shelter resourceType", "location latitude longitude name");
      if (transportDetails) {
        additionalDetails = {
          shelter: transportDetails.shelter?.location || "Unknown",
          shelterLatitude: transportDetails.shelter?.latitude,
          shelterLongitude: transportDetails.shelter?.longitude,
          resourceType: transportDetails.resourceType?.name || "Unknown",
          deliveryDateTime: transportDetails.deliveryDateTime,
        };
      }
    } else if (task.taskType === "Preparing and Serving Food") {
      const foodDetails = await FoodTask.findOne({ taskId }).populate("shelter", "location latitude longitude");
      if (foodDetails) {
        additionalDetails = {
          shelter: foodDetails.shelter?.location || "Unknown",
          shelterLatitude: foodDetails.shelter?.latitude,
          shelterLongitude: foodDetails.shelter?.longitude,
        };
      }
    }
    else if (task.taskType === "Resource Distribution") {
      const resDetails = await ResourceDist.findOne({ taskId }).populate("shelter", "location latitude longitude");
      console.log(resDetails);
      if (resDetails) {
        additionalDetails = {
          shelter: resDetails.shelter?.location || "Unknown",
          shelterLatitude: resDetails.shelter?.latitude,
          shelterLongitude: resDetails.shelter?.longitude,
        };
      }
    }

    res.json({ ...task.toObject(), ...additionalDetails });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add these routes to your Express server
// Add these routes to your Express server

// Get all completed tasks (with volunteers having taskStatus 4)
// router.get('/completed', async (req, res) => {
//   try {
//     // Fetch all tasks and populate volunteer and incident details
//     const tasks = await Task.find()
//       .populate('volunteer') // Fetch volunteer details
//       .populate('incident');  // Fetch incident details

//     res.json(tasks);
//   } catch (err) {
//     console.error('Error fetching completed tasks:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// Get all completed tasks
router.get('/completed', async (req, res) => {
  try {
    // Find all volunteers with taskStatus 4 (completed)
    const completedVolunteers = await Volunteer.find({ taskStatus: 4 });
    const volunteerIds = completedVolunteers.map(volunteer => volunteer._id);
    
    // Find all tasks assigned to these volunteers
    const tasks = await Task.find({ 
      volunteer: { $in: volunteerIds }
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    // Create an array to hold the enhanced task data
    const enhancedTasks = [];
    
    // For each task, fetch the volunteer and any type-specific details
    for (const task of tasks) {
      // Get volunteer information
      const volunteer = await Volunteer.findById(task.volunteer).populate('userId', 'name email phone');
      
      // Get incident information
      const incident = await Incident.findById(task.incident);
      
      // Initialize additional details object
      let additionalDetails = {};
      
      // Based on task type, fetch additional details
      if (task.taskType === 'Transportation and Distribution') {
        const transportDetails = await TransportationTask.findOne({ taskId: task._id });
        if (transportDetails) {
          const shelter = await Shelter.findById(transportDetails.shelter);
          const resourceType = await ResourceType.findById(transportDetails.resourceType);
          
          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            resourceType: resourceType ? resourceType.name : 'Unknown',
            deliveryDateTime: transportDetails.deliveryDateTime
          };
        }
      } else if (task.taskType === 'Preparing and Serving Food') {
        const foodDetails = await FoodTask.findOne({ taskId: task._id });
        if (foodDetails) {
          const shelter = await Shelter.findById(foodDetails.shelter);
          
          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown'
          };
        }
      } 
      else if (task.taskType === 'Resource Distribution') {
        const resDetails = await ResourceDist.findOne({ taskId: task._id });
        if (resDetails) {
          const shelter = await Shelter.findById(resDetails.shelter);
          
          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown'
          };
        }
      }
      else if (task.taskType === 'Rescue Operation Management' || task.taskType === 'Rescue Operator') {
        // Nothing additional to fetch for rescue tasks
        const rescueDetails = await RescueTask.findOne({ taskId: task._id });
        additionalDetails = {};
      }
      
      // Add enhanced task to array
      enhancedTasks.push({
        _id: task._id,
        taskType: task.taskType,
        description: task.description,
        createdAt: task.createdAt,
        volunteer: volunteer ? {
          _id: volunteer._id,
          name: volunteer.userId ? volunteer.userId.name : 'Unknown',
          email: volunteer.userId ? volunteer.userId.email : 'Unknown',
          phone: volunteer.userId ? volunteer.userId.phone : 'Unknown',
          taskStatus: volunteer.taskStatus
        } : null,
        incident: incident ? {
          location: incident.location,
          type: incident.type,
          severity: incident.severity
        } : null,
        ...additionalDetails
      });
    }
    
    res.status(200).json(enhancedTasks);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get completed tasks by type
router.get('/completed/:taskType', async (req, res) => {
  try {
    const { taskType } = req.params;
    
    // Find all volunteers with taskStatus 4 (completed)
    const completedVolunteers = await Volunteer.find({ taskStatus: 4 });
    const volunteerIds = completedVolunteers.map(volunteer => volunteer._id);
    
    // Find tasks of the specified type assigned to these volunteers
    const tasks = await Task.find({ 
      volunteer: { $in: volunteerIds },
      taskType 
    }).sort({ createdAt: -1 }); // Sort by newest first
    
    // Create an array to hold the enhanced task data
    const enhancedTasks = [];
    
    // For each task, fetch the volunteer and any type-specific details
    for (const task of tasks) {
      // Get volunteer information
      const volunteer = await Volunteer.findById(task.volunteer).populate('userId', 'name email phone');
      
      // Get incident information
      const incident = await Incident.findById(task.incident);
      
      // Initialize additional details object
      let additionalDetails = {};
      
      // Based on task type, fetch additional details
      if (taskType === 'Transportation and Distribution') {
        const transportDetails = await TransportationTask.findOne({ taskId: task._id });
        if (transportDetails) {
          const shelter = await Shelter.findById(transportDetails.shelter);
          const resourceType = await ResourceType.findById(transportDetails.resourceType);
          
          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown',
            resourceType: resourceType ? resourceType.name : 'Unknown',
            deliveryDateTime: transportDetails.deliveryDateTime
          };
        }
      } else if (taskType === 'Preparing and Serving Food') {
        const foodDetails = await FoodTask.findOne({ taskId: task._id });
        if (foodDetails) {
          const shelter = await Shelter.findById(foodDetails.shelter);
          
          additionalDetails = {
            shelter: shelter ? shelter.location : 'Unknown'
          };
        }
        else if (task.taskType === 'Resource Distribution') {
          const resDetails = await ResourceDist.findOne({ taskId: task._id });
          if (resDetails) {
            const shelter = await Shelter.findById(resDetails.shelter);
            
            additionalDetails = {
              shelter: shelter ? shelter.location : 'Unknown'
            };
          }
        }
      } else if (taskType === 'Rescue Operation Management' || taskType === 'Rescue Operator') {
        // Nothing additional to fetch for rescue tasks
        const rescueDetails = await RescueTask.findOne({ taskId: task._id });
        additionalDetails = {};
      }
      
      // Add enhanced task to array
      enhancedTasks.push({
        _id: task._id,
        taskType: task.taskType,
        description: task.description,
        createdAt: task.createdAt,
        volunteer: volunteer ? {
          _id: volunteer._id,
          name: volunteer.userId ? volunteer.userId.name : 'Unknown',
          email: volunteer.userId ? volunteer.userId.email : 'Unknown',
          phone: volunteer.userId ? volunteer.userId.phone : 'Unknown',
          taskStatus: volunteer.taskStatus
        } : null,
        incident: incident ? {
          location: incident.location,
          type: incident.type,
          severity: incident.severity
        } : null,
        ...additionalDetails
      });
    }
    
    res.status(200).json(enhancedTasks);
  } catch (error) {
    console.error('Error fetching completed tasks by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update volunteer task status (for verification)
router.patch('/verify-completion/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Find the volunteer associated with the task
    const volunteer = await Volunteer.findById(task.volunteer);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    
    // Update volunteer's task status to 0 (Available)
    volunteer.taskStatus = 0;
    await volunteer.save();
    
    res.status(200).json({ 
      message: 'Task completion verified successfully',
      volunteerId: volunteer._id,
      taskId: task._id
    });
  } catch (error) {
    console.error('Error verifying task completion:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// // Update volunteer's taskStatus
// router.patch('/volunteers/:volunteerId/update-status', async (req, res) => {
//   try {
//     const { volunteerId } = req.params;
//     const { taskStatus } = req.body;
    
//     const volunteer = await Volunteer.findById(volunteerId);
    
//     if (!volunteer) {
//       return res.status(404).json({ message: 'Volunteer not found' });
//     }
    
//     // Update the volunteer's taskStatus
//     volunteer.taskStatus = taskStatus;
//     await volunteer.save();
    
//     res.json({ message: 'Volunteer status updated successfully', volunteer });
//   } catch (err) {
//     console.error('Error updating volunteer status:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


module.exports = router;
