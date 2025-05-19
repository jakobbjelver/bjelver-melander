import { ContentLengths, ContentSources } from "@/types/test"

export const getSourceFromMask = (index: number) => {
    return Object.values(ContentSources).at(index)
}

export const getMaskFromSource = (source: ContentSources) => {
    return Object.values(ContentSources).indexOf(source)
}

export const getLengthFromMask = (index: number) => {
    return Object.values(ContentLengths).at(index)
}

export const getMaskFromLength = (length: ContentLengths) => {
    return Object.values(ContentLengths).indexOf(length)
}