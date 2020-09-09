import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
//  3 2  
//  1 0
export default [
  {
    id: 'default-auckland',
    key: 'Auckland',
    predictionPlace: {
      address: 'Auckland, Auckland Region, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-36.685119, 175.228302),
        new LatLng(-36.960217, 174.658896)
      ),
    },
  },
  {
    id: 'default-christchurch',
    key: 'Christchurch',
    predictionPlace: {
      address: 'Christchurch, Canterbury, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-43.389891, 172.808772),
        new LatLng(-43.628593, 172.389378)
      ),
    },
  },  
  {
    id: 'default-coromandel',
    key: 'Coromandel',
    predictionPlace: {
      address: 'Coromandel, Waikato, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-36.421362, 175.949194),
        new LatLng(-36.88569, 175.325511)
      ),
    },
  },
  {
    id: 'default-Dunedin',
    key: 'Dunedin',
    predictionPlace: {
      address: 'Dunedin, Otago, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-45.772203, 170.75089),
        new LatLng(-45.953174, 170.290199)
      ),
    },
  },
  {
    id: 'default-Gisborne',
    key: 'Gisborne',
    predictionPlace: {
      address: 'Gisborne, Gisborne, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-38.387547, 178.320389),
        new LatLng(-38.842201, 177.267578)
      ),
    },
  },
  {
    id: 'default-Hamilton',
    key: 'Hamilton',
    predictionPlace: {
      address: 'Hamilton, Waikato, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-37.616711, 175.472659),
        new LatLng(-38.025212, 174.932227)
      ),
    },
  },
  {
    id: 'default-Hastings',
    key: 'Hastings',
    predictionPlace: {
      address: "Hastings, Hawke's Bay, New Zealand",
      bounds: new LatLngBounds(
        new LatLng(-39.097864, 177.097644),
        new LatLng(-40.269602, 175.83004)
      ),
    },
  },
  {
    id: 'default-Hibiscus-Coast',
    key: 'Hibiscus Coast',
    predictionPlace: {
      address: '',
      bounds: new LatLngBounds(
        new LatLng(-36.559531, 174.700943),
        new LatLng(-36.599896, 174.663518)
      ),
    },
  },
  {
    id: 'default-Invercargill',
    key: 'Invercargill',
    predictionPlace: {
      address: 'Invercargill, Southland, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-46.122726, 168.957919),
        new LatLng(-46.660824, 168.134981)
      ),
    },
  },
  {
    id: 'default-Lower-Hutt',
    key: 'Lower Hutt',
    predictionPlace: {
      address: 'Lower Hutt, Wellington, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-41.137017, 175.03553),
        new LatLng(-41.385178, 174.847204)
      ),
    },
  },
  {
    id: 'default-Napier',
    key: 'Napier',
    predictionPlace: {
      address: "Napier, Hawke's Bay, New Zealand",
      bounds: new LatLngBounds(
        new LatLng(-38.855956, 177.065295),
        new LatLng(-39.598632, 176.369526)
      ),
    },
  },
  {
    id: 'default-Nelson',
    key: 'Nelson',
    predictionPlace: {
      address: 'Nelson, Nelson, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-41.124809, 173.580908),
        new LatLng(-42.305573, 172.342695)
      ),
    },
  },
  {
    id: 'default-New-Plymouth',
    key: 'New Plymouth',
    predictionPlace: {
      address: 'New Plymouth, Taranaki, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-38.995804, 174.296578),
        new LatLng(-39.298879, 173.765208)
      ),
    },
  },
  {
    id: 'default-Palmerston-North',
    key: 'Palmerston North',
    predictionPlace: {
      address: 'Palmerston North, Manawatu-Wanganui, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-40.170936, 175.79059),
        new LatLng(-40.632721, 175.224084)
      ),
    },
  },
  {
    id: 'default-Queenstown',
    key: 'Queenstown',
    predictionPlace: {
      address: 'Queenstown, Otago, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-44.523064, 169.047838),
        new LatLng(-45.158764, 168.3959)
      ),
    },
  },
  {
    id: 'default-Rotorua',
    key: 'Rotorua',
    predictionPlace: {
      address: 'Rotorua, BayPlenty, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-37.905427, 176.734725),
        new LatLng(-38.469587, 175.899754)
      ),
    },
  },
  {
    id: 'default-Tauranga',
    key: 'Tauranga',
    predictionPlace: {
      address: 'Tauranga, BayPlenty, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-37.267447, 176.438071),
        new LatLng(-37.940125, 175.907493)
      ),
    },
  },
  {
    id: 'default-Upper-Hutt',
    key: 'Upper Hutt',
    predictionPlace: {
      address: 'Upper Hutt, Wellington, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-40.949343, 175.306296),
        new LatLng(-41.226206, 174.967499)
      ),
    },
  },
  {
    id: 'default-Whanganui',
    key: 'Whanganui',
    predictionPlace: {
      address: 'Whanganui, Manawatu-Wanganui, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-39.391073, 175.515357),
        new LatLng(-40.102356, 174.701274)
      ),
    },
  },
  {
    id: 'default-Whangarei',
    key: 'Whangarei',
    predictionPlace: {
      address: '',
      bounds: new LatLngBounds(
        new LatLng(-35.443967, 174.748133),
        new LatLng(-35.952719, 173.750088)
      ),
    },
  },
  {
    id: 'default-wellington',
    key: 'Wellington',
    predictionPlace: {
      address: 'Wellington, Wellington Region, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-41.14354, 174.846901),
        new LatLng(-41.362789, 174.687193)
      ),
    },
  },
];
