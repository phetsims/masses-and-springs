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
  var ConstantsControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/ConstantsControlPanel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var OscillatingSpringNode = require( 'MASSES_AND_SPRINGS/common/view/OscillatingSpringNode' );
  var RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SpringLengthControlPanel = require( 'MASSES_AND_SPRINGS/intro/view/SpringLengthControlPanel' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var TwoSpringView = require( 'MASSES_AND_SPRINGS/common/view/TwoSpringView' );

  // constants
  var IMAGE_SCALE = .3;

  // strings
  var constantString = require( 'string!MASSES_AND_SPRINGS/constant' );

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
      model.selectedConstantProperty,
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

      // Toggle visibility of panels
      self.springLengthControlPanel.visible = (mode === 'adjustable-length');
      self.constantsControlPanel.visible = self.springLengthControlPanel.visible;
      self.firstSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;
      self.secondSpringConstantControlPanel.visible = !self.springLengthControlPanel.visible;

      // 
      model.springs[ 0 ].naturalRestingLengthProperty.link( function( lineLength ) {
        if ( model.selectedConstantProperty.get() === 'spring-thickness' ) {
          console.log( 'thickness = ' + self.firstOscillatingSpringNode.lineWidthProperty.get() );
          console.log( 'spring constant = ' + model.springs[ 0 ].springConstantProperty.get() );
          self.firstOscillatingSpringNode.lineWidthProperty.set( self.firstOscillatingSpringNode.lineWidthProperty.get() );
          self.firstOscillatingSpringNode.lineWidthProperty.set( 8 * lineLength );
        }
        if ( model.selectedConstantProperty.get() === 'spring-constant' ) {
          console.log( 'thickness = ' + self.firstOscillatingSpringNode.lineWidthProperty.get() );
          console.log( 'spring constant = ' + model.springs[ 0 ].springConstantProperty.get() );
          self.firstOscillatingSpringNode.lineWidthProperty.set( self.firstOscillatingSpringNode.lineWidthProperty.get() );
          self.firstOscillatingSpringNode.lineWidthProperty.set( 8 * lineLength );
        }
      } );
      // Reset springs when scenes are switched
      if ( mode === 'same-length' ) {
        model.springs[ 0 ].reset();
        model.springs[ 1 ].reset();
      }
    } );

    // @private {read-only} Creation of springs for use in scene switching icons
    var firstSpringIcon = new OscillatingSpringNode( model.springsIcon[ 0 ], this.mvt );
    firstSpringIcon.loopsProperty.set( 10 );
    firstSpringIcon.lineWidthProperty.set( 3 );

    var secondSpringIcon = new OscillatingSpringNode( model.springsIcon[ 1 ], this.mvt );
    secondSpringIcon.loopsProperty.set( 10 );
    secondSpringIcon.lineWidthProperty.set( 3 );

    var thirdSpringIcon = new OscillatingSpringNode( model.springsIcon[ 2 ], this.mvt );
    thirdSpringIcon.loopsProperty.set( 5 );
    thirdSpringIcon.lineWidthProperty.set( 3 );

    // @private {read-only} White background for scene switching icons
    var iconBackground = new Rectangle( firstSpringIcon.x - 40, 25, 160, 190, 2, 2, { fill: 'white' } );

    // @private {read-only} Creation of same length icon node
    var sameLengthIcon = new Node( { scale: IMAGE_SCALE } );
    sameLengthIcon.addChild( iconBackground );
    sameLengthIcon.addChild( firstSpringIcon );
    sameLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of adjustable length icon node
    var differentLengthIcon = new Node( { scale: IMAGE_SCALE } );
    differentLengthIcon.addChild( iconBackground );
    differentLengthIcon.addChild( thirdSpringIcon );
    differentLengthIcon.addChild( secondSpringIcon );

    // @private {read-only} Creation of toggled modes for scene selection
    var toggleButtonsContent = [ {
      value: 'same-length',
      node: sameLengthIcon
    }, {
      value: 'adjustable-length',
      node: differentLengthIcon
    } ];

    // @private {read-only} Creation of icons for scene selection
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
    sceneRadioButtonGroup.moveToBack();
  }

  massesAndSprings.register( 'IntroScreenView', IntroScreenView );

  return inherit( TwoSpringView, IntroScreenView );
} );