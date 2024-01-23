/* SPDX-License-Identifier: Apache-2.0 */

DROP INDEX dataset_fields_dataset_uuid_name_key CASCADE;
ALTER TABLE dataset_fields ADD UNIQUE (dataset_uuid, name, type);
