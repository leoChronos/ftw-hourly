import { types as sdkTypes } from './util/sdkLoader';

const { LatLng, LatLngBounds } = sdkTypes;

// An array of locations to show in the LocationAutocompleteInput when
// the input is in focus but the user hasn't typed in any search yet.
//
// Each item in the array should be an object with a unique `id` (String) and a
// `predictionPlace` (util.types.place) properties.
export default [
  {
    id: 'default-auckland',
    predictionPlace: {
      address: 'Auckland, Auckland Region, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-36.685119, 175.228302),
        new LatLng(-36.960217, 174.658896)
      ),
    },
  },
  {
    id: 'default-wellington',
    predictionPlace: {
      address: 'Wellington, Wellington Region, New Zealand',
      bounds: new LatLngBounds(
        new LatLng(-41.14354, 174.846901),
        new LatLng(-41.362789, 174.687193)
      ),
    },
  },
];
