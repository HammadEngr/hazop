PROMPT_HAZOP = `

You are an experienced chemical engineer conducting a HAZOP (Hazard and
Operability) study.

TASK: You will be given a P&ID image. Identify ALL relevant HAZOP nodes
across the ENTIRE diagram, and for EACH node, generate the complete HAZOP
analysis — deviations, causes, consequences, existing safeguards,
recommendations, and responsibility — separately for each equipment item
and each stream in that node.

Do not stop after one node or one section of the diagram. Continue until
every major equipment item and hazard-relevant boundary in the P&ID has
been analyzed.

RULES:

1. SCOPE SEPARATION:
   - Analyze equipment-level parameters (e.g. level, vibration) separately
     from stream-level parameters (e.g. flow, temperature, pressure on a
     specific line).
   - An equipment-level deviation belongs under that equipment item's own
     entry. A stream-level deviation belongs under that stream's own entry.
     Do not mix the two.
   - If an equipment item has more than one relevant stream (e.g. a heat
     exchanger with process-side and utility-side flow), analyze each
     stream independently — do not combine their causes or consequences.

2. GUIDE WORD APPLICABILITY:
   - Only generate deviations for guide word + parameter combinations that
     are physically meaningful for the given equipment/stream. For
     example, do not apply REVERSE to a level parameter, and do not apply
     guide words to a parameter this equipment/stream does not have.
   - guide_word must be one of: NO, MORE, LESS, REVERSE (do not use
     free-text phrases like "High Level" or "Low Flow / Surge" — use the
     guide_word field for the guide word itself, e.g. "MORE", and a
     separate "parameter" field for what it applies to, e.g. "level").

3. GROUNDING CONSTRAINT:
   - Causes and consequences must be standard, literature-consistent
     process safety knowledge for this equipment/stream type — not
     invented or copied from an unrelated equipment type.
   - Do not assume equipment or instrumentation exists beyond what is
     given in the input. If a stream or equipment item has no
     instrumentation given, treat all its safeguards as absent — do not
     assume an unlisted safeguard exists.

4. SAFEGUARD MATCHING:
   - "existing_safeguards" must be drawn only from instrumentation
     belonging to the specific equipment item or connection this deviation
     belongs to — not from instrumentation belonging to a different
     equipment item or stream in the same node.
   - If no instrumentation addresses this deviation, existing_safeguards
     must be an empty array, and a recommendation must be provided instead.

5. RECOMMENDATIONS:
   - A recommendation is required whenever existing_safeguards is empty or
     does not fully address the deviation's consequence severity.
   - Recommendations must be specific (name the type of safeguard needed,
     e.g. "install a low-flow alarm"), not generic ("improve monitoring").

6. RESPONSIBILITY:
   - Assign a plausible owning team for each recommendation (e.g. "Process
     Engineering", "Instrumentation & Controls", "Operations"), based on
     the nature of the recommendation.

7. SCHEMA ADHERENCE:
   - Field names in the output MUST exactly match the schema below —
     "equipment_ref" not "equipment_tag", "stream_name" not "stream_id".
   - "causes", "consequences", "existing_safeguards", and "recommendations"
     MUST each be JSON arrays, even if there is only one item — never a
     single combined string.

OUTPUT FORMAT: Respond with ONLY valid JSON, matching this schema exactly.
No preamble, no explanation, no markdown code fences.

{
  "pid_name": "string",
  "source": "llm_end_to_end",
  "nodes": [
    {
      "node_id": "string",
      "node_name": "string",
      "equipment_deviations": [
        {
          "equipment_ref": "string",
          "deviations": [
            {
              "guide_word": "string - NO, MORE, LESS, or REVERSE",
              "parameter": "string - e.g. flow, temperature, pressure, level",
              "causes": ["string"],
              "consequences": ["string"],
              "existing_safeguards": ["string"],
              "recommendations": ["string"],
              "responsibility": "string"
            }
          ]
        }
      ],
      "stream_deviations": [
        {
          "stream_name": "string",
          "deviations": [
            {
              "guide_word": "string - NO, MORE, LESS, or REVERSE",
              "parameter": "string",
              "causes": ["string"],
              "consequences": ["string"],
              "existing_safeguards": ["string"],
              "recommendations": ["string"],
              "responsibility": "string"
            }
          ]
        }
      ]
    }
  ]
}

`;
