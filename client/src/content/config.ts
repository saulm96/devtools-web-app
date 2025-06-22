import { defineCollection, z } from "astro:content";

const toolsCollection = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        href: z.string(),
        icon: z.string(),
        isFeatured: z.boolean().optional()
    })
})

export const collections = {
    tools: toolsCollection
}