import ImagePicker, {
  ImageOrVideo,
  Options,
} from 'react-native-image-crop-picker';

import {
  requestCameraPermission,
  requestPhotoLibraryPermission,
} from './permission';

export interface PickedMedia {
  path: string;
  width: number;
  height: number;
  mime: string;
  size?: number;
  data?: string; // base64 if needed
}

const baseOptions: Options = {
  cropping: false,
  includeBase64: false,
  includeExif: true,
  compressImageQuality: 0.9,
  mediaType: 'photo',
  forceJpg: true,
};

// --- Mapper ---
const mapToPicked = (media: ImageOrVideo): PickedMedia => {
  return {
    path: media.path,
    width: media.width ?? 0,
    height: media.height ?? 0,
    mime: media.mime ?? '',
    size: media.size,
    data: (media as any).data, // only if includeBase64 = true
  };
};

// --- Pick from gallery ---
export const pickFromGallery = async (): Promise<PickedMedia | null> => {
  try {
    const granted = await requestPhotoLibraryPermission();
    if (!granted) return null;

    const media = await ImagePicker.openPicker({
      ...baseOptions,
      multiple: false,
    });
    return mapToPicked(media);
  } catch (error) {
    console.warn('Gallery pick cancelled:', error);
    return null;
  }
};

// --- Pick from camera ---
export const pickFromCamera = async (): Promise<PickedMedia | null> => {
  try {
    const granted = await requestCameraPermission();
    if (!granted) return null;

    const media = await ImagePicker.openCamera(baseOptions);
    return mapToPicked(media);
  } catch (error) {
    console.warn('Camera capture cancelled:', error);
    return null;
  }
};
