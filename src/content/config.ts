import { defineCollection, z, type ImageFunction } from "astro:content";

const workExperienceSchema = (image: ImageFunction) =>
    z.object({
        title: z.string(),
        company: z.string(),
        timeline: z.string(),
        website: z.string(),
        points: z.array(z.string()),
        coverImage: image().optional(),
        position: z.number(),
    });

const experienceCollection = defineCollection({
    type: "data",
    schema: ({ image }) => workExperienceSchema(image),
});

export const collections = {
    "work-experiences": experienceCollection,
};

export type WorkExperience = z.infer<ReturnType<typeof workExperienceSchema>>;
