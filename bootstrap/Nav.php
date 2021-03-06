<?php
/**
 * @link http://2amigos.us/
 * @copyright Copyright (c) 2013 2amigOS! Consulting Group  LLC
 * @license http://www.opensource.org/licenses/bsd-license.php New BSD License
 */

namespace wheels\bootstrap;

use wheels\helpers\ArrayHelper;

/**
 * Nav renders a nav HTML component.
 *
 * For example:
 *
 * ```php
 * echo Nav::widget(array(
 *     'items' => array(
 *         array(
 *             'label' => 'Home',
 *             'url' => '/',
 *             'linkOptions' => array(...),
 *             'active' => true,
 *         ),
 *         array(
 *             'label' => 'Dropdown',
 *             'items' => array(
 *                  array(
 *                      'label' => 'Level 1 -DropdownA',
 *                      'url' => '#',
 *                      'items' => array(
 *                          array(
 *                              'label' => 'Level 2 -DropdownA',
 *                              'url' => '#',
 *                          ),
 *                      ),
 *                  ),
 *                  array(
 *                      'label' => 'Level 1 -DropdownB',
 *                      'url' => '#',
 *                  ),
 *             ),
 *         ),
 *     ),
 * ));
 * ```
 *
 * @author Antonio Ramirez <amigo.cobos@gmail.com>
 * @package wheels\bootstrap
 * @since 1.0
 */
class Nav extends Widget
{
	/**
	 * @var array list of items in the nav widget. Each array element represents a single
	 * menu item with the following structure:
	 *
	 * - label: string, required, the nav item label.
	 * - url: optional, the item's URL. Defaults to "#".
	 * - linkOptions: array, optional, the HTML attributes of the item's link.
	 * - options: array, optional, the HTML attributes of the item container (LI).
	 * - active: boolean, optional, whether the item should be on active state or not.
	 * - dropdown: array|string, optional, the configuration array for creating a [[Dropdown]] widget,
	 *   or a string representing the dropdown menu. Note that Bootstrap does not support sub-dropdown menus.
	 */
	public $items = array();
	/**
	 * @var boolean whether the nav items labels should be HTML-encoded.
	 */
	public $encodeLabels = true;


	/**
	 * Initializes the widget.
	 */
	public function init()
	{
		parent::init();
		$this->addCssClass($this->options, 'nav');
	}

	/**
	 * Renders the widget.
	 */
	public function run()
	{
		echo $this->renderItems();
	}

	/**
	 * Renders widget items.
	 */
	public function renderItems()
	{
		$items = array();
		foreach ($this->items as $item) {
			$items[] = $this->renderItem($item);
		}

		return \Chtml::tag('ul', $this->options, implode("\n", $items));
	}

	/**
	 * Renders a widget's item.
	 * @param mixed $item the item to render.
	 * @return string the rendering result.
	 * @throws \CException
	 */
	public function renderItem($item)
	{
		if (is_string($item)) {
			return $item;
		}
		if (!isset($item['label'])) {
			throw new \CException("The 'label' option is required.");
		}
		$label = $this->encodeLabels ? \CHtml::encode($item['label']) : $item['label'];
		$options = ArrayHelper::getValue($item, 'options', array());
		$items = ArrayHelper::getValue($item, 'items');
		$url = \Yii::app()->createUrl(ArrayHelper::getValue($item, 'url', '#'));
		$linkOptions = ArrayHelper::getValue($item, 'linkOptions', array());

		if (ArrayHelper::getValue($item, 'active')) {
			$this->addCssClass($options, 'active');
		}

		if ($items !== null) {
			$linkOptions['data-toggle'] = 'dropdown';
			$this->addCssClass($options, 'dropdown');
			$this->addCssClass($urlOptions, 'dropdown-toggle');
			$label .= ' ' . \CHtml::tag('b', array('class' => 'caret'), '');
			if (is_array($items)) {
				$items = Dropdown::widget(array(
					'items' => $items,
					'clientOptions' => false,
				));
			}
		}

		return \CHtml::tag('li', $options, \CHtml::link($label, $url, $linkOptions) . $items);
	}
}
