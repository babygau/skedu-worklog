import chai from 'chai'
import _ from 'lodash'
import {rangeCheck, normaliseRanges} from '../../src/js/util'
let expect = chai.expect
/**
* Problems when creating worklog is worklogs
* created by a range between `check_in` and `check_out`
* could be overlapped each other
* Let's say we have 100 ranges that it possible any
* two of them could overlap, result in failing
* The idea is to FIND A WAY TO RESOLVE THE OVERLAP ISSUES
* The solution must satisfy the following conditions:
*   - All ranges are sorted in ascend order
*   - Be able to detect if ranges are overlapped
*   - Be able to find out which points they are overlapped
*     Call it `intersection`
*   - Make `intersection` optimal by removing the continuous
*   - Be able to make `mother_of_source` range which is a
*     merged array of unique values of every ranges
*   - Slice `mother_of_source` into smaller ranges and
*     these ranges are not operlapped
**/
describe('Solve Time Range Overlap', () => {
  let range1, range2, range3, range4,
      source_of_ranges, mother_of_ranges,
      intersections, optimal_intersections,
      mother_of_source


  beforeEach(() => {
    // Create some ranges to test
    range1 = _.range(1, 10)
    range2 = _.range(4, 6)
    range3 = _.range(8, 12)
    range4 = _.range(15, 20)
    source_of_ranges = [range1, range2, range3, range4]
    mother_of_ranges = rangeCheck(source_of_ranges)
    intersections = mother_of_ranges[0]
    mother_of_source = mother_of_ranges[1]

  })


  describe('mother_of_ranges:', () => {
    it('should contain unoptimal intersections and unoptimal mother_of_source', () => {

      expect(intersections).to.be.deep.equal([4, 5, 8, 9])
      expect(mother_of_source).to.be.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 8, 9, 10, 11, 15, 16, 17, 18, 19])
    })
  })

  describe('mother_of_source:', () => {
    it('should be sorted and contain unique values of range', () => {

      mother_of_source = _.uniq(mother_of_source)
      expect(mother_of_source).to.be.deep.equal([ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 16, 17, 18, 19 ])
    })
  })

  describe('new splitted range:', () => {
    it('should be splitted according to number of optimal intersections', () => {
      mother_of_source = _.uniq(mother_of_source)
      let optimal_ranges = normaliseRanges(source_of_ranges)
      expect(optimal_ranges).to.be.deep.equal([[5, 6, 7, 8, 9], [1, 2, 3, 4, 5]])
    })
  })
})
