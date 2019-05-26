/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	const ProductCategory = sequelize.define('ProductCategory', {
		productId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'product_id'
		},
		categoryId: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			field: 'category_id'
		}
	}, {
		tableName: 'product_category'
	});

	return ProductCategory;
};
