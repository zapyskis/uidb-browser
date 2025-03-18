import { useState, useEffect, useMemo, useCallback } from 'react';
import { Autocomplete, TextField, Paper, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDevices } from '../hooks/useDevices';
import { Device } from '../types/device';
import { SearchIconL } from '@ubnt/icons';
import { designToken } from '@ubnt/ui-components';
import { Text } from '@ubnt/ui-components/aria';

const AUTOCOMPLETE_LIMIT = 10;

const STYLES = {
  container: 'flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full',
  deviceCount: 'whitespace-nowrap',
  optionContainer: 'flex justify-between w-full items-center',
  productName: 'truncate pr-2',
  productAbbrev: 'whitespace-nowrap',
};

const BREAKPOINT = {
  smallScreen: 640,
  defaultWidth: 320,
  mobileWidth: 280,
};

const COMMON_STYLES = {
  backgroundColor: designToken.motifs.light['desktop-color-neutral-02'],
  fontFamily: 'UI Sans',
  fontSize: '14px',
};

const useSearchWidth = () => {
  const getSearchWidth = () =>
    window.innerWidth < BREAKPOINT.smallScreen ? BREAKPOINT.mobileWidth : BREAKPOINT.defaultWidth;
  const [searchWidth, setSearchWidth] = useState(getSearchWidth());

  useEffect(() => {
    const handleResize = () => setSearchWidth(getSearchWidth());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return searchWidth;
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
    {count} Devices
  </Text>
);

export const Search = ({ onSelect }: Props) => {
  const [value, setValue] = useState<Device | null>(null);
  const [inputValue, setInputValue] = useState('');
  const { devices, setSearchTerm } = useDevices();
  const searchWidth = useSearchWidth();

  const uniqueDevices = useMemo(
    () =>
      devices.filter((device, index, self) => index === self.findIndex((d) => d.product.name === device.product.name)),
    [devices],
  );

  const limitedDevices = useMemo(() => uniqueDevices.slice(0, AUTOCOMPLETE_LIMIT), [uniqueDevices]);

  const handleInputChange = useCallback(
    (_event: unknown, newInputValue: string) => {
      setInputValue(newInputValue);
      setSearchTerm(newInputValue);
    },
    [setSearchTerm],
  );

  const handleChange = useCallback(
    (_event: unknown, newValue: Device | null) => {
      setValue(newValue);
      onSelect?.(newValue);
    },
    [onSelect],
  );

  return (
    <div className={STYLES.container}>
      <Autocomplete<Device, false, false, false>
        freeSolo={true}
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        options={limitedDevices}
        getOptionLabel={(option: Device) => option.product.name}
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
            }}
          />
        )}
        sx={{
          width: searchWidth,
        }}
      />
      <DeviceCount count={devices.length} />
    </div>
  );
};
