// Copyright 2016, University of Colorado Boulder

/**
 * Panel responsible for keeping the spring constant and spring thickness constant.
 * This panel should only be visible when in scene with adjustable spring length.
 *
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Panel = require( 'SUN/Panel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var thicknessString = require( 'string!MASSES_AND_SPRINGS/thickness' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.TITLE_FONT;
  var MAX_TEXT_WIDTH = MassesAndSpringsConstants.MAX_TEXT_WIDTH;
  var FONT = MassesAndSpringsConstants.FONT;

  /**
   *
   * @param {Property.<string>} selectedConstant determines which value to hold constant, values are 'spring-constant' and 'spring-thickness'
   * @param {string} title: string used to title the panel
   * @param {Object} options
   * @constructor
   */
  function ConstantsControlPanel( selectedConstant, title, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: false
    }, options );

    var constantsSelectionButtonOptions = {
      font: FONT,
      maxWidth: MAX_TEXT_WIDTH
    };

    // TODO: Add logic for setting values for each aqua button.
    // TODO: Follow the logic of the scene selection radio button (not playspeed).
    // @private {read-only} radius of button
    var constantsSelectionButtonRadius = 6;
    var thicknessText = new Text( thicknessString, constantsSelectionButtonOptions );
    var thicknessRadioBox = new AquaRadioButton( selectedConstant, 'spring-constant', thicknessText, {
      radius: constantsSelectionButtonRadius
    } );

    var constantText = new Text( StringUtils.format( springConstantString, '' ), constantsSelectionButtonOptions );
    var springConstantRadioBox = new AquaRadioButton( selectedConstant, 'spring-thickness', constantText, {
      radius: constantsSelectionButtonRadius
    } );

    // @private {read-only} spacing used for radio buttons
    var radioButtonSpacing = 4;
    Panel.call( this, new VBox( {
      align: 'left',
      spacing: radioButtonSpacing,
      children: [
        new Text( title, { font: TITLE_FONT } ),
        springConstantRadioBox,
        thicknessRadioBox
      ]
    } ), options );
  }

  massesAndSprings.register( 'ConstantsControlPanel', ConstantsControlPanel );

  return inherit( Panel, ConstantsControlPanel );

} );
