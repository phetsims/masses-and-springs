// Copyright 2017, University of Colorado Boulder

/**
 * ScreenView for the 'Intro' screen
 * 
 * @author Matt Pennington
 * @author Denzell Barnett
 */
define( function( require ) {
  'use strict';

  // modules
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/common/view/ConstantsControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var SpringLengthControlPanel = require( 'MASSES_AND_SPRINGS/common/view/SpringLengthControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );

  // constants
  var IMAGE_SCALE = .3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );

  // images
  var differentLengthIcon = require( 'image!MASSES_AND_SPRINGS/different-length-scene.png' );
  var sameLengthIcon = require( 'image!MASSES_AND_SPRINGS/same-length-scene.png' );

  /**
   * @param {MassesAndSpringsModel} model
   * @constructor
   */
  function IntroScreenView( model ) {

    var self = this;

    // Calls common two spring view
    TwoSpringView.call( this, model );

    // Spring Constant Length Control Panel
    this.springLengthControlPanel = new SpringLengthControlPanel(
      model.springs[ 0 ].naturalRestingLengthProperty,
      new RangeWithValue( .1, .5, .3 ),
      StringUtils.format( 'Length 1', 1 ),
      {
        right: this.springHangerNode.springHangerNode.left - 40,
        top: this.topSpacing,
        maxWidth: 125
      } );
    this.addChild( this.springLengthControlPanel );

    // @private panel that keeps thickness/spring constant at constant value
    this.constantsControlPanel = new ConstantsControlPanel(
      this.firstOscillatingSpringNode.lineWidthProperty,
      model.springs[ 0 ].springConstantProperty,
      constantString,
      {
        minWidth: this.firstSpringConstantControlPanel.maxWidth,
        left: this.firstSpringConstantControlPanel.left,
        top: this.firstSpringConstantControlPanel.bottom + this.topSpacing
      }
    );
    this.addChild( this.constantsControlPanel );

    // Link that is responsible for switching the scenes
    model.springLengthModeProperty.link( function( mode ) {
      self.springLengthControlPanel.visible = (mode === 'adjustable-length');
      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      model.springs[ 0 ].naturalRestingLengthProperty.link( function( lineLength ) {
        // var lineWidth = options.minLineWidth + options.deltaLineWidth * ( springConstant - spring.springConstantRange.min ) / 2;
        // self.lineWidthProperty.set( lineWidth );
        self.firstOscillatingSpringNode.lineWidthProperty.set( 8 * lineLength );

      } );
      // Reset springs when scenes are switched
      if ( mode === 'same-length' ) {
        model.springs[ 0 ].reset();
        model.springs[ 1 ].reset();
      }
    } );

    //TODO: Create Icon node programmatically
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: new Image( sameLengthIcon, { scale: IMAGE_SCALE } )
    }, {
      value: 'adjustable-length',
      node: new Image( differentLengthIcon, { scale: IMAGE_SCALE } )
    } ];

    var sceneRadioButtonGroup = new RadioButtonGroup( model.springLengthModeProperty, toggleButtonsContent, {
      buttonContentXMargin: 4,
      buttonContentYMargin: 4,
      top: this.toolboxPanel.bottom + 55,
      right: this.gravityControlPanel.right,
      baseColor: 'black',
      selectedStroke: 'yellow',
      deselectedStroke: 'yellow',
      selectedLineWidth: 1.3,
      deselectedLineWidth: 0.6,
      orientation: 'horizontal',
      spacing: 13
    } );
    this.addChild( sceneRadioButtonGroup );
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );