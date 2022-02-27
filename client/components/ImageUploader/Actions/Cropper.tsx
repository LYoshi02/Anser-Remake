import { useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import {
  Box,
  Button,
  Flex,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
} from "@chakra-ui/react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;

type Props = {
  image: string;
  onUploadImage: (croppedArea: Area) => void;
};

const ImageCropper = (props: Props) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const onCropChange = (location: Point) => {
    setCrop(location);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const finishCrop = async () => {
    if (!croppedAreaPixels) return;
    props.onUploadImage(croppedAreaPixels);
  };

  return (
    <Box>
      <Flex bgColor="gray.200" h="96" rounded="sm" position="relative">
        <Cropper
          image={props.image}
          aspect={1}
          cropShape="round"
          crop={crop}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          zoom={zoom}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
        />
      </Flex>
      <Box mt="4">
        <Text>Zoom:</Text>
        <Slider
          aria-label="Zoom Slider"
          value={zoom}
          min={MIN_ZOOM}
          max={MAX_ZOOM}
          step={0.1}
          onChange={onZoomChange}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Box>
      <Button isFullWidth colorScheme="purple" mt="4" onClick={finishCrop}>
        Finish and Upload
      </Button>
    </Box>
  );
};

export default ImageCropper;
