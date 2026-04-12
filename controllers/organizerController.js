const Event = require("../models/Event");
const User = require("../models/User");

const getOrganizerDashboard = async (req, res) => {
  try {
    const organizer = await User.findById(req.user.id).select("-password");

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    const events = await Event.find({ organizerId: req.user.id }).sort({
      createdAt: -1,
    });

    const now = new Date();

    const totalEvents = events.length;

    const upcomingEvents = events.filter((event) => {
      if (!event.date) return false;
      const parsed = new Date(event.date);
      return !Number.isNaN(parsed.getTime()) && parsed >= now;
    }).length;

    const ticketsSold = events.reduce(
      (sum, event) => sum + (Number(event.ticketsSold) || 0),
      0
    );

    const recentEvents = events.slice(0, 5);

    res.status(200).json({
      organizer: {
        id: organizer._id,
        name: organizer.name,
        email: organizer.email,
        companyName: organizer.companyName || "",
        role: organizer.role || "Organizer",
      },
      stats: {
        totalEvents,
        upcomingEvents,
        ticketsSold,
      },
      recentEvents,
    });
  } catch (error) {
    console.error("getOrganizerDashboard error:", error);
    res.status(500).json({
      message: "Failed to load organizer dashboard",
      details: error.message,
    });
  }
};

module.exports = {
  getOrganizerDashboard,
};
