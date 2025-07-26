import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { appConfig } from '../../config';

const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: appConfig.API_SERVICE_NAME,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${appConfig.OTL_COLETOR_URL}/v1/metrics`,
    }),
  }),
  traceExporter: new OTLPTraceExporter({
    url: `${appConfig.OTL_COLETOR_URL}/v1/traces`,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
