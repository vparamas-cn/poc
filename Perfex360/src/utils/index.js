export const groupby = (list,type) => {
    return list.reduce((groups, item) => {
        const group = (groups[item[type]] || []);
        group.push(item);
        groups[item[type]] = group;
        return groups;
      }, {});
}