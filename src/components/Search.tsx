import { useState, useEffect, useCallback } from 'react';
import { Autocomplete, TextField, Paper, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDevices } from '../hooks/useDevices';
import { useIsSmallScreen } from '../hooks/useIsSmallScreen';
import { Device } from '../types/device';
import { SearchIconL } from '@ubnt/icons';
import { designToken } from '@ubnt/ui-components';
import { Text } from '@ubnt/ui-components/aria';

const STYLES = {
  container: 'flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full',
  deviceCount: 'whitespace-nowrap',
  optionContainer: 'flex justify-between w-full items-center',
  productName: 'truncate pr-2',
  productAbbrev: 'whitespace-nowrap',
};

const BREAKPOINT = {
  defaultWidth: 320,
  mobileWidth: 280,
};

const COMMON_STYLES = {
  backgroundColor: designToken.motifs.light['desktop-color-neutral-02'],
  fontFamily: 'UI Sans',
  fontSize: '14px',
};

const useSearchWidth = () => {
  const isSmallScreen = useIsSmallScreen();
  return isSmallScreen ? BREAKPOINT.mobileWidth : BREAKPOINT.defaultWidth;
};

const StyledPaper = styled(Paper)({
  marginTop: 0,
  borderRadius: 4,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  '& .MuiAutocomplete-listbox': {
    padding: 0,
    maxHeight: '330px !important',
    '& .MuiAutocomplete-option': {
      ...COMMON_STYLES,
      backgroundColor: 'transparent',
      fontWeight: 400,
      height: 32,
      minHeight: 'unset',
      margin: 0,
      padding: '0 12px',
      display: 'flex',
      alignItems: 'center',
      '&[data-focus="true"]': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
      '&[aria-selected="true"]': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
      '&:hover': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
      '&.Mui-focused': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
      '&.Mui-selected': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
      '&.Mui-selected.Mui-focused': {
        backgroundColor: `${designToken.motifs.light['desktop-color-neutral-02']} !important`,
      },
    },
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: designToken.motifs.light['desktop-color-neutral-04'],
      borderRadius: '2px',
    },
  },
  '& .MuiAutocomplete-noOptions': {
    ...COMMON_STYLES,
    padding: '8px 12px',
    color: designToken.motifs.light['desktop-color-text-3'],
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: 32,
    borderRadius: 4,
    ...COMMON_STYLES,
    fontWeight: 400,
    '&:hover': {
      backgroundColor: designToken['desktop-color-neutral-02-light'],
      '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${designToken.motifs.light['desktop-color-ublue-06']} !important`,
      },
    },
    '&.Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${designToken.motifs.light['desktop-color-ublue-06']} !important`,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiOutlinedInput-input': {
      ...COMMON_STYLES,
    },
  },
  '& .MuiInputAdornment-root': {
    marginRight: 0,
  },
});

const StyledProductName = styled('span')({
  color: designToken.motifs.light['desktop-color-text-2'],
});

const StyledProductAbbrev = styled('span')({
  color: designToken.motifs.light['desktop-color-text-3'],
});

interface Props {
  onSelect?: (device: Device | null) => void;
}

const highlightMatch = (text: string, searchText: string, deviceId: string) => {
  if (!searchText) return text;

  const parts = text.split(new RegExp(`(${searchText})`, 'gi'));

  return parts.map((part, index) =>
    part.toLowerCase() === searchText.toLowerCase() ? (
      <span key={`${deviceId}-${text}-${index}`} style={{ textDecoration: 'underline' }}>
        {part}
      </span>
    ) : (
      part
    ),
  );
};

const DeviceCount: React.FC<{ count: number }> = ({ count }) => (
  <Text variant="caption" color="text-4" className={STYLES.deviceCount}>
    {count} {count === 1 ? 'Device' : 'Devices'}
  </Text>
);

export const Search = ({ onSelect }: Props) => {
  const { devices, setSearchTerm, searchTerm } = useDevices();

  const [value, setValue] = useState<Device | null>(null);

  const [inputValue, setInputValue] = useState(searchTerm);
  const searchWidth = useSearchWidth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 100);

    return () => clearTimeout(timer);
  }, [inputValue, setSearchTerm]);

  const handleInputChange = useCallback((_event: unknown, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  const handleChange = useCallback(
    (_event: unknown, newValue: string | Device | null) => {
      if (typeof newValue === 'string') {
        setValue(null);
        onSelect?.(null);
      } else {
        setValue(newValue);
        onSelect?.(newValue);
      }
    },
    [onSelect],
  );

  return (
    <div className={STYLES.container}>
      <Autocomplete
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={devices}
        freeSolo
        noOptionsText="No Results"
        getOptionLabel={(option: Device | string) => (typeof option === 'string' ? option : option.product.name)}
        renderOption={(props, option: Device) => (
          <li {...props} key={option.id}>
            <div className={STYLES.optionContainer}>
              <StyledProductName className={STYLES.productName}>
                {highlightMatch(option.product.name, inputValue, option.id)}
              </StyledProductName>
              <StyledProductAbbrev className={STYLES.productAbbrev}>{option.product.abbrev}</StyledProductAbbrev>
            </div>
          </li>
        )}
        PaperComponent={StyledPaper}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder="Search"
            fullWidth
            size="small"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIconL />
                </InputAdornment>
              ),
              endAdornment: null,
            }}
          />
        )}
        sx={{
          width: searchWidth,
          '& .MuiAutocomplete-endAdornment': {
            display: 'none',
          },
        }}
      />
      <DeviceCount count={devices.length} />
    </div>
  );
};
