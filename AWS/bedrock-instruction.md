# Bedrock Agent Instructions

When adding items to a requisition:

1. Extract ALL parameters: requisition_id, item_name, quantity, and material_code
2. Always include material_code in your API call if provided by the user
3. Call AddRequisitionLineItems with all extracted parameters