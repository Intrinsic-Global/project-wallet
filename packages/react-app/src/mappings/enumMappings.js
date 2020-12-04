function humanReadableTreatyStatus(int) {
  const i = parseInt(int);
  switch (i) {
    case 0:
      return "Draft";
    case 1:
      return "Active";
    case 2:
      return "Binding";
    case 3:
      return "Broken";
    case 4:
      return "MutuallyWithdrawn";
    default:
      return "Unknown";
  }
}

function humanReadableSignatureStatus(int) {
  const i = parseInt(int);
  switch (i) {
    case 0:
      return "NotRegistered";
    case 1:
      return "Unsigned";
    case 2:
      return "Signed";
    case 3:
      return "Withdrawn";
    case 4:
      return "Broken";
    default:
      return "Unknown";
  }
}
// enum SignatureState { Unsigned, Signed, Withdrawn, Broken }

exports.humanReadableTreatyStatus = humanReadableTreatyStatus;
exports.humanReadableSignatureStatus = humanReadableSignatureStatus;