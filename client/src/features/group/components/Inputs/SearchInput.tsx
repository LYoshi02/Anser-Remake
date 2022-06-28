import { useState, useEffect, useRef } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";

type Props = {
  onSearchUser: (searchText: string) => void;
};

const SearchInput = ({ onSearchUser }: Props) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === inputRef.current!.value) {
        onSearchUser(search.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, inputRef, onSearchUser]);

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
          ref={inputRef}
        />
        {search.length > 0 && (
          <InputRightElement cursor="pointer" onClick={cleanSearch}>
            <Icon as={HiX} />
          </InputRightElement>
        )}
      </InputGroup>
    </Box>
  );
};

export default SearchInput;
