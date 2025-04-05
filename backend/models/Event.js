


  const mongoose = require("mongoose");

  const eventSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },
      date: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      venue: {
        type: String,
        required: true,
      },
      images: [
        {
          data: {
            type: Buffer,
            required: true
          },
          contentType: {
            type: String,
            required: true
          },
          fileName: {
            type: String,
            required: true
          },
          alt: {
            type: String,
            default: function() {
              return `${this.title} image`;
            }
          }
        }
      ]
    },
    { timestamps: true }
  );

  const Event = mongoose.model("Event", eventSchema);

  module.exports = Event;