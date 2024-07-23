interface IImage {
    url: string;
    public_id: string;
    _id: string;
}

export interface IImageSliderProps {
    images: IImage[];
}