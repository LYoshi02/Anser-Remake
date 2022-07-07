import { useState, useEffect, useRef } from "react";
import { HiSearch, HiX } from "react-icons/hi";
import {
  Box,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";

type Props = {
  onSearch: (searchText: string) => void;
  inputProps?: InputProps;
};

const SearchInput = ({ onSearch, inputProps }: Props) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === inputRef.current!.value) {
        onSearch(search.trim());
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, inputRef, onSearch]);

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          ref={inputRef}
          {...inputProps}
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
