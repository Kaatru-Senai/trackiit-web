export default async function data(i) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const completedRoutes = [
    [13.006163, 80.241801],
    [13.005486, 80.241787],
    [13.005342, 80.241761],
    [13.005251, 80.241814],
    [13.00432, 80.241821],
    [13.004079, 80.24168],
    [13.003186, 80.240274],[13.00356, 80.240393],
    [13.001343, 80.239647],
    [12.998981, 80.239236],
    [12.998009, 80.238938],
  ];
  return completedRoutes[i];
}
