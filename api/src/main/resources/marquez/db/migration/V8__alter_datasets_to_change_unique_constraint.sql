/* SPDX-License-Identifier: Apache-2.0 */

DROP INDEX datasets_namespace_uuid_source_uuid_name_physical_name_key CASCADE;
ALTER TABLE datasets ADD UNIQUE (namespace_uuid, name);
ALTER TABLE datasets ADD UNIQUE (source_uuid, physical_name);
