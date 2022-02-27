import { useState } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

const SearchInput = () => {
  const [search, setSearch] = useState("");

  const cleanSearch = () => {
    setSearch("");
  };

  return (
    <Box mb="2">
      <InputGroup zIndex="0">
        <InputLeftElement pointerEvents="none">
          <Icon as={HiSearch} />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Buscar usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search.trim().length > 0 && (
          <InputRightElement cursor="pointer" onClick={cleanSearch}>
            <Icon as={HiX} />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
