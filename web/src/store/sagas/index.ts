// Copyright 2018-2023 contributors to the Marquez project
// SPDX-License-Identifier: Apache-2.0

import * as Effects from 'redux-saga/effects'
import {
  ADD_DATASET_TAG,
  DELETE_DATASET,
  DELETE_DATASET_TAG,
  DELETE_JOB,
  FETCH_DATASET,
  FETCH_DATASETS,
  FETCH_DATASET_VERSIONS,
  FETCH_EVENTS,
  FETCH_JOBS,
  FETCH_JOB_FACETS,
  FETCH_LINEAGE,
  FETCH_RUNS,
  FETCH_RUN_FACETS,
  FETCH_SEARCH,
} from '../actionCreators/actionTypes'
import {
  Dataset,
  DatasetVersion,
  Datasets,
  Events,
  Facets,
  Jobs,
  LineageGraph,
  Namespaces,
  Tags,
} from '../../types/api'
import { all, put, take } from 'redux-saga/effects'

const call: any = Effects.call

import { Job } from '../../types/api'
import { Search } from '../../types/api'
import {
  addDatasetTag,
  deleteDataset,
  deleteDatasetTag,
  deleteJob,
  getDataset,
  getDatasetVersions,
  getDatasets,
  getEvents,
  getJobFacets,
  getJobs,
  getNamespaces,
  getRunFacets,
  getRuns,
  getTags,
} from '../requests'
import {
  addDatasetTagSuccess,
  applicationError,
  deleteDatasetSuccess,
  deleteDatasetTagSuccess,
  deleteJobSuccess,
  fetchDatasetSuccess,
  fetchDatasetVersionsSuccess,
  fetchDatasetsSuccess,
  fetchEventsSuccess,
  fetchFacetsSuccess,
  fetchJobsSuccess,
  fetchLineageSuccess,
  fetchNamespacesSuccess,
  fetchRunsSuccess,
  fetchSearchSuccess,
  fetchTagsSuccess,
} from '../actionCreators'
import { getLineage } from '../requests/lineage'
import { getSearch } from '../requests/search'

export function* fetchTags() {
  try {
    const response: Tags = yield call(getTags)
    const { tags } = response
    yield put(fetchTagsSuccess(tags))
  } catch (e) {
    yield put(applicationError('Something went wrong while fetching initial data.'))
  }
}

export function* fetchNamespaces() {
  try {
    const response: Namespaces = yield call(getNamespaces)
    const { namespaces } = response
    yield put(fetchNamespacesSuccess(namespaces))
  } catch (e) {
    yield put(applicationError('Something went wrong while fetching initial data.'))
  }
}

export function* fetchLineage() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_LINEAGE)
      const result: LineageGraph = yield call(
        getLineage,
        payload.nodeType,
        payload.namespace,
        payload.name,
        payload.depth
      )
      yield put(fetchLineageSuccess(result))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching lineage'))
    }
  }
}

export function* fetchSearch() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_SEARCH)
      const result: Search = yield call(getSearch, payload.q, payload.filter, payload.sort)
      yield put(fetchSearchSuccess(result))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching search'))
    }
  }
}

export function* fetchRunsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_RUNS)
      const { runs } = yield call(getRuns, payload.jobName, payload.namespace)
      yield put(fetchRunsSuccess(payload.jobName, runs))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching job runs'))
    }
  }
}

export function* fetchJobsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_JOBS)
      const response: Jobs = yield call(getJobs, payload.namespace, payload.limit, payload.offset)
      yield put(fetchJobsSuccess(response.jobs, response.totalCount))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching job runs'))
    }
  }
}

export function* deleteJobSaga() {
  while (true) {
    try {
      const { payload } = yield take(DELETE_JOB)
      const job: Job = yield call(deleteJob, payload.jobName, payload.namespace)
      yield put(deleteJobSuccess(job.name))
    } catch (e) {
      yield put(applicationError('Something went wrong while removing job'))
    }
  }
}

export function* fetchDatasetsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_DATASETS)
      const datasets: Datasets = yield call(
        getDatasets,
        payload.namespace,
        payload.limit,
        payload.offset
      )
      yield put(fetchDatasetsSuccess(datasets.datasets, datasets.totalCount))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching dataset runs'))
    }
  }
}

export function* fetchEventsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_EVENTS)
      const events: Events = yield call(
        getEvents,
        payload.after,
        payload.before,
        payload.limit,
        payload.offset
      )
      yield put(fetchEventsSuccess(events))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching event runs'))
    }
  }
}

export function* fetchDatasetSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_DATASET)
      const datasets: Dataset = yield call(getDataset, payload.namespace, payload.name)
      yield put(fetchDatasetSuccess(datasets))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching dataset'))
    }
  }
}

export function* deleteDatasetSaga() {
  while (true) {
    try {
      const { payload } = yield take(DELETE_DATASET)
      const dataset: Dataset = yield call(deleteDataset, payload.datasetName, payload.namespace)
      yield put(deleteDatasetSuccess(dataset.name))
    } catch (e) {
      yield put(applicationError('Something went wrong while removing job'))
    }
  }
}

export function* deleteDatasetTagSaga() {
  while (true) {
    try {
      const { payload } = yield take(DELETE_DATASET_TAG)
      const dataset: Dataset = yield call(
        deleteDatasetTag,
        payload.namespace,
        payload.datasetName,
        payload.tag
      )
      yield put(deleteDatasetTagSuccess(dataset.name))
    } catch (e) {
      yield put(applicationError('Something went wrong while removing tag from dataset'))
    }
  }
}

export function* addDatasetTagSaga() {
  while (true) {
    try {
      const { payload } = yield take(ADD_DATASET_TAG)
      const dataset: Dataset = yield call(
        addDatasetTag,
        payload.namespace,
        payload.datasetName,
        payload.tag
      )
      yield put(addDatasetTagSuccess(dataset.name))
    } catch (e) {
      yield put(applicationError('Something went wrong while adding tag to dataset'))
    }
  }
}

export function* fetchDatasetVersionsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_DATASET_VERSIONS)
      const datasets: DatasetVersion[] = yield call(
        getDatasetVersions,
        payload.namespace,
        payload.name
      )
      yield put(fetchDatasetVersionsSuccess(datasets))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching dataset runs'))
    }
  }
}

export function* fetchJobFacetsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_JOB_FACETS)
      const jobFacets: Facets = yield call(getJobFacets, payload.runId)
      yield put(fetchFacetsSuccess(jobFacets))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching job facets'))
    }
  }
}

export function* fetchRunFacetsSaga() {
  while (true) {
    try {
      const { payload } = yield take(FETCH_RUN_FACETS)
      const runFacets: Facets = yield call(getRunFacets, payload.runId)
      yield put(fetchFacetsSuccess(runFacets))
    } catch (e) {
      yield put(applicationError('Something went wrong while fetching run facets'))
    }
  }
}

export default function* rootSaga(): Generator {
  const sagasThatAreKickedOffImmediately = [fetchNamespaces(), fetchTags()]
  const sagasThatWatchForAction = [
    fetchJobsSaga(),
    fetchRunsSaga(),
    fetchDatasetsSaga(),
    fetchDatasetSaga(),
    fetchDatasetVersionsSaga(),
    fetchEventsSaga(),
    fetchJobFacetsSaga(),
    fetchRunFacetsSaga(),
    fetchLineage(),
    fetchSearch(),
    deleteJobSaga(),
    deleteDatasetSaga(),
    deleteDatasetTagSaga(),
    addDatasetTagSaga(),
  ]

  yield all([...sagasThatAreKickedOffImmediately, ...sagasThatWatchForAction])
}
