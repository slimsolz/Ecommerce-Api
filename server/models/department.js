/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Department', {
		departmentId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'department_id'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name'
		},
		description: {
			type: DataTypes.STRING(1000),
			allowNull: true,
			field: 'description'
		}
	}, {
		tableName: 'department'
	});
};
