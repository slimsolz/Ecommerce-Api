/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Attribute', {
		attributeId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'attribute_id'
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
			field: 'name'
		}
	}, {
		tableName: 'attribute'
	});
};
