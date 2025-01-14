/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AnomalySwimlaneEmbeddableFactory } from './anomaly_swimlane_embeddable_factory';
import { coreMock } from '@kbn/core/public/mocks';
import { dataPluginMock } from '@kbn/data-plugin/public/mocks';
import { AnomalySwimlaneEmbeddable } from './anomaly_swimlane_embeddable';
import { AnomalySwimlaneEmbeddableInput } from '..';

jest.mock('./anomaly_swimlane_embeddable', () => ({
  AnomalySwimlaneEmbeddable: jest.fn(),
}));

describe('AnomalySwimlaneEmbeddableFactory', () => {
  test('should provide required services on create', async () => {
    // arrange
    const pluginStartDeps = { data: dataPluginMock.createStartContract() };

    const getStartServices = coreMock.createSetup({
      pluginStartDeps,
    }).getStartServices;

    const [coreStart, pluginsStart] = await getStartServices();

    // act
    const factory = new AnomalySwimlaneEmbeddableFactory(getStartServices, false);

    await factory.create({
      jobIds: ['test-job'],
    } as AnomalySwimlaneEmbeddableInput);

    // assert
    const mockCalls = (AnomalySwimlaneEmbeddable as unknown as jest.Mock<AnomalySwimlaneEmbeddable>)
      .mock.calls[0];
    const input = mockCalls[0];
    const createServices = mockCalls[1];

    expect(input).toEqual({
      jobIds: ['test-job'],
    });
    expect(Object.keys(createServices[0])).toEqual(Object.keys(coreStart));
    expect(createServices[1]).toMatchObject(pluginsStart);
    expect(Object.keys(createServices[2])).toEqual([
      'anomalyDetectorService',
      'anomalyTimelineService',
    ]);
  });
});
