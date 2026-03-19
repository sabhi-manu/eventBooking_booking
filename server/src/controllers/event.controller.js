import AppError from "../utils/appError";



export async function createEvent(req, res) {
    const { title, description, date, location, category, totalSeat, availableSeat, image, ticketPrice } = req.body;
    if(!title || !description || !date || !location || !category || !totalSeat || !availableSeat) throw new AppError(400,"All fields required")
    
        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeat,
            availableSeat,
            image : image || "",
            ticketPrice,
            createdBy: req.user._id
        })
        await event.save()


    res.status(200).json({
        success: true,
        message: "event created successfully."
    })
}

export function getEvents(req, res) {
    res.status(200).json({
        success: true,
        message: "events fetched successfully."
    })
}

export function getEventById(req, res) {
    res.status(200).json({
        success: true,
        message: "event fetched successfully."
    })
}

export function updateEvent(req, res) {
    res.status(200).json({
        success: true,
        message: "event updated successfully."
    })
}   

export function deleteEvent(req, res) {
    res.status(200).json({
        success: true,
        message: "event deleted successfully."
    })
}
