import { useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import { HiEye, HiEyeOff } from "react-icons/hi";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";

type Props = {
  placeholder?: string;
  hookForm: UseFormRegisterReturn;
};

const PasswordInput = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <InputGroup>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={props.placeholder}
        {...props.hookForm}
      />
      <InputRightElement>
        <IconButton
          aria-label="Password Visiblity"
          colorScheme="gray"
          icon={showPassword ? <HiEye /> : <HiEyeOff />}
          onClick={() => setShowPassword((prev) => !prev)}
        />
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
