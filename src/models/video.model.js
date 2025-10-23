
import mongoose, { Schema } from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinery url
            required: true,
        },
        thumbnail: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //cloudinery url
            required: true
        },
        views: {
            type: Number,
            default: 0,
        },
        isPublic : {
            type: Boolean,
            default: true
        },
        owner: {
           type: Schema.Types.ObjectId,
            ref: "User"
        }

    }
)

videoSchema.plugin(mongooseAggregatePaginate) //no we can write aggregate queries also

export const Video = mongoose.model("Video" , videoSchema)