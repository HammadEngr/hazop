import * as hx_rules from "./rules/heat_exchanger.json" with { type: "json" };
import * as nodes_file from "./nodes/claude/methanol_crude_distillation.json" with { type: "json" };

const { nodes } = nodes_file.default;
const { heat_exchanger: rules } = hx_rules.default;

const equipment_heat_exchanger = nodes.filter((node) =>
  node.equipment.some((eq) => eq.type === "heat_exchanger"),
);

const streams = Object.keys(rules);

const HAZOP = Object.fromEntries(streams.map((s) => [s, {}]));

console.log(HAZOP);
