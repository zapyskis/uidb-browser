import { useState, SyntheticEvent, useEffect } from 'react';
import { Autocomplete, TextField, Paper, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDevices } from '../hooks/useDevices';
import { Device } from '../types/device';
import { SearchIconL } from '@ubnt/icons';
import { designToken } from '@ubnt/ui-components';
import { Text } from '@ubnt/ui-components/aria';

const STYLES = {
  container: 'flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 w-full',
  deviceCount: 'whitespace-nowrap',
};

const BREAKPOINT = {
  smallScreen: 640,
  defaultWidth: 320,
  mobileWidth: 280,
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
    '& .MuiAutocomplete-option': {
      fontSize: '14px',
      fontFamily: 'UI Sans',
      fontWeight: 400,
      minHeight: 32,
      margin: 0,
      padding: '6px 12px',
      '&[data-focus="true"]': {
        backgroundColor: '#F6F6F8 !important',
      },
      '&[aria-selected="true"]': {
        backgroundColor: '#F6F6F8 !important',
      },
      '&:hover': {
        backgroundColor: '#F6F6F8 !important',
      },
      '&.Mui-focused': {
        backgroundColor: '#F6F6F8 !important',
      },
      '&.Mui-selected': {
        backgroundColor: '#F6F6F8 !important',
      },
      '&.Mui-selected.Mui-focused': {
        backgroundColor: '#F6F6F8 !important',
      },
    },
  },
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    height: 32,
    borderRadius: 4,
    backgroundColor: '#F6F6F8',
    fontFamily: 'inherit',
    fontSize: '14px',
    fontWeight: 400,
    '&:hover': {
      backgroundColor: designToken['desktop-color-neutral-02-light'],
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#e0e0e0',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#e0e0e0',
      border: 'none',
    },
    '& .MuiOutlinedInput-input': {
      fontFamily: 'UI Sans',
      fontSize: 'inherit',
    },
  },
  '& .MuiInputAdornment-root': {
    marginRight: 0,
  },
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

  // Remove duplicate products based on product name
  const uniqueDevices = devices.filter(
    (device, index, self) => index === self.findIndex((d) => d.product.name === device.product.name),
  );

  return (
    <div className={STYLES.container}>
      <Autocomplete<Device>
        freeSolo
        value={value}
        inputValue={inputValue}
        onInputChange={(_event, newInputValue) => {
          setInputValue(newInputValue);
          setSearchTerm(newInputValue);
        }}
        onChange={(_event: SyntheticEvent, newValue: Device | null) => {
          setValue(newValue);
          onSelect?.(newValue);
        }}
        options={uniqueDevices}
        getOptionLabel={(option: Device) => option.product.name}
        renderOption={(props, option: Device) => (
          <li {...props} key={option.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span className="truncate pr-2">{highlightMatch(option.product.name, inputValue, option.id)}</span>
              <span className="whitespace-nowrap" style={{ color: '#666' }}>
                {highlightMatch(option.product.abbrev, inputValue, option.id)}
              </span>
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
