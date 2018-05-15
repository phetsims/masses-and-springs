// Copyright 2017-2018, University of Colorado Boulder

/**
 * Spring view used for the energy screen.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GravityAndDampingControlNode = require( 'MASSES_AND_SPRINGS/common/view/GravityAndDampingControlNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Vector2 = require( 'DOT/Vector2' );
  var OneSpringScreenView = require( 'MASSES_AND_SPRINGS/common/view/OneSpringScreenView' );

  /**
   * @param {EnergyModel} model
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function EnergyScreenView( model, tandem ) {

    // Calls common spring view
    OneSpringScreenView.call( this, model, tandem );
    var self = this;

    // Contains visibility options for the reference lines and displacement arrow
    var indicatorVisibilityControlNode = this.createIndicatorVisibilityPanel( model, false, tandem );

    // Gravity Control Panel
    var gravityAndDampingControlNode = new GravityAndDampingControlNode(
      model, this, tandem.createTandem( 'gravityAndDampingControlNode' ), {
        maxWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        dampingVisible: true,
        xMargin: 0,
        yMargin: 0,
        stroke: null,
        hSlider: true
      } );

    // VBox that contains all of the panel's content
    var optionsVBox = new VBox( {
      spacing: 10,
      children: [
        indicatorVisibilityControlNode,
        MassesAndSpringsConstants.LINE_SEPARATOR( 165 ),
        gravityAndDampingControlNode
      ]
    } );

    // Panel that will display all the toggleable options.
    var optionsPanel = this.createOptionsPanel( optionsVBox, tandem );

    // Contains all of the options for the reference lines, gravity, damping, and toolBox
    var rightPanelsVBox = new VBox( { children: [ optionsPanel, self.toolboxPanel ], spacing: this.spacing } );
    this.addChild( rightPanelsVBox );
    rightPanelsVBox.moveToBack();

    this.visibleBoundsProperty.link( function( visibleBounds ) {
      rightPanelsVBox.rightTop = visibleBounds.rightTop.plus( new Vector2( -self.spacing, self.spacing ) );
    } );
  }
  massesAndSprings.register( 'EnergyScreenView', EnergyScreenView );

  return inherit( OneSpringScreenView, EnergyScreenView );
} );