import moment from 'moment'
import _ from 'lodash'

export function createPickerState(options = {
  format: 'DD/MM/YYYY',
  viewMode: 'days',
  mode: 'date'
}) {
  return {
    dateTime: moment().format(options.format),
    format: options.format,
    inputFormat: options.format,
    maxDate: moment(),
    minDate: moment(),
    viewMode: options.viewMode,
    mode: options.mode
  }
}

// This function will split overlapped ranges into smaller one
// `prev_intersections` is used to reserve intersection points
// after `ranges` is updated
export function normaliseRanges(ranges = [], prev_intersections = []) {
  let [intersections, mother_of_source] = rangeCheck(ranges)

  // Don't need to normalize ranges if they are not overlapped
  if (intersections.length == 0) {
    return ranges
  } else {
    console.log('intersections inside normaliseRanges', intersections)
    mother_of_source = _.uniq(mother_of_source)

    // Concat to the last reserved intersections
    intersections = _.chain(prev_intersections)
                      .concat(intersections)
                      // Make sure intersections are sorted before any operations
                      .sortBy()
                      .value()

    // Optimize intersections
    let optimal_intersections =
          _.chain(intersections)
            .reduce((prev, curr) => {
              if (prev[prev.length - 1] === curr - 1 || prev[prev.length - 1] === curr) {
                  prev[prev.length - 1] = curr
                  return prev
              }
              return prev.concat(curr)
            },
            [intersections[0]]
            )
            // Make sure optimal intersections are sorted before any operations
            .sortBy()
            .value()

    console.log('intersections inside normaliseRanges and optimal', optimal_intersections)
    let res = groupRangeBy(mother_of_source, optimal_intersections, optimal_intersections.length)
    let normalise_ranges =
          _.chain(res)
            // Eliminate ranges that don't have `[true]` properties
            .filter(obj => obj['true'] !== undefined)
            .map(obj => obj['true'])
            // Sort array elements
            .map(arr => _.chain(arr).sortBy().value())
            .filter(arr => arr.length > 1)
            .sortBy()
            .value()

    return normalise_ranges
  }
}

export function rangeCheck(ranges = []) {
  return _.reduce(
          ranges,
          (prev, curr) => {
            let first = prev[0].concat(_.intersection(prev[1], curr))
            let second = prev[1].concat(curr)
            return [first, second]
          },
          [[], []]
        )
}
export function recursiveBinarySearch(array, value, left = 0, right = array.length) {
  if (left > right) {
    return -1
  }
  let middle = Math.floor((right + left) / 2)
  if (_.isEqual(array[middle], value)) {
    return middle
  } else if (array[middle] > value) {
    return recursiveBinarySearch(array, value, left, middle - 1)
  } else {
    return recursiveBinarySearch(array, value, middle + 1, right)
  }
}

function groupRangeBy(arr, comp, n, res = []) {
  if (n <= 1) {
    res.push(_.groupBy(arr, i => i <= comp[0]))
    return res
  } else {
    res.push(_.groupBy(arr, i => (i <= comp[n-1] && i >= comp[n-2])))
    return groupRangeBy(arr, comp, n-1, res)
  }
}

export function convertTime(time) {
  let hour = Math.floor(time / 60)
  // Prepend `0` to single number
  let hour_str = (hour.toString()).length < 2 ? '0' + hour.toString() : hour.toString()
  let min = time % 60
  let min_str = min.toString()
  let hours_mins = hour_str + min_str
  return moment(hours_mins, 'HHmm').format('hh:mm A')
}
