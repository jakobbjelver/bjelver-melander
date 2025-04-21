import { contentLengths, contentSources } from "../db/schema"

export const getSourceFromMask = (index: number) => {
    return Object.values(contentSources).at(index)
}

export const getMaskFromSource = (source: contentSources) => {
    return Object.keys(contentSources).indexOf(source)
}

export const getLengthFromMask = (index: number) => {
    return Object.values(contentLengths).at(index)
}

export const getMaskFromLength = (length: contentLengths) => {
    return Object.keys(contentLengths).indexOf(length)
}