import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddressFormProps {
  streetAddress: string;
  setStreetAddress: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  postalCode: string;
  setPostalCode: (value: string) => void;
  country: string;
  setCountry: (value: string) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  streetAddress,
  setStreetAddress,
  city,
  setCity,
  postalCode,
  setPostalCode,
  country,
  setCountry,
}) => {
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Italy',
    'Spain', 'Netherlands', 'Japan', 'South Korea', 'Brazil', 'Mexico', 'Argentina', 'Chile',
    'Colombia', 'Peru', 'Venezuela', 'Austria', 'Belgium', 'Switzerland', 'Denmark', 'Finland',
    'Norway', 'Sweden', 'Ireland', 'Portugal', 'Greece', 'Poland', 'Czech Republic', 'Hungary',
    'Romania', 'Bulgaria', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania',
    'Russia', 'Ukraine', 'Belarus', 'China', 'India', 'Indonesia', 'Thailand', 'Vietnam',
    'Malaysia', 'Singapore', 'Philippines', 'Taiwan', 'Hong Kong', 'New Zealand', 'South Africa',
    'Nigeria', 'Kenya', 'Egypt', 'Morocco', 'Israel', 'Turkey', 'Saudi Arabia', 'UAE',
    'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Cyprus', 'Malta', 'Iceland',
    'Luxembourg', 'Monaco', 'Liechtenstein', 'San Marino', 'Vatican City', 'Andorra', 'Other'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((countryOption) => (
              <SelectItem key={countryOption} value={countryOption}>
                {countryOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AddressForm;
