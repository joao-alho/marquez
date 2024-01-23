/* SPDX-License-Identifier: Apache-2.0 */

SET enable_experimental_alter_column_type_general = true;
alter table runs alter column transitioned_at type timestamp without time zone
    USING transitioned_at::timestamp without time zone;
